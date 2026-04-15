<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AbaPayService
{
    private string $merchantId;
    private string $apiKey;
    private string $paywayUrl;

    public function __construct()
    {
        $this->merchantId = config('services.aba.merchant_id', '');
        $this->apiKey     = config('services.aba.api_key', '');
        $this->paywayUrl  = rtrim(config('services.aba.payway_url', 'https://checkout-sandbox.payway.com.kh'), '/');
    }

    /**
     * Build all signed form fields for the PayWay popup checkout.
     * Returns an array ready to be rendered as hidden inputs in the browser.
     * No HTTP call is made — the browser submits directly to PayWay via the JS popup.
     */
    public function getPaymentFormData(Order $order): array
    {
        $reqTime  = now()->utc()->format('YmdHis');
        $tranId   = $order->order_number;
        $amount   = number_format((float) $order->total, 2, '.', '');
        $shipping = number_format((float) $order->shipping, 2, '.', '');

        $items = $order->items->map(fn($i) => [
            'name'     => $i->product_name,
            'quantity' => (int) $i->quantity,
            'price'    => number_format((float) $i->unit_price, 2, '.', ''),
        ])->values()->toJson();

        $nameParts = explode(' ', trim($order->customer_name), 2);
        $firstname = $nameParts[0] ?? $order->customer_name;
        $lastname  = $nameParts[1] ?? '';
        $phone     = $this->normalizePhone($order->customer_phone);

        $returnUrl          = route('orders.confirmation', $order->order_number);
        $cancelUrl          = route('cart.index');
        $continueSuccessUrl = $returnUrl;
        $returnDeeplink     = '';
        $currency           = 'USD';
        $customFields       = '';
        $returnParams       = '';
        $lifetime           = '15';
        $additionalParams   = '';
        $googlePayToken     = '';
        $skipSuccessPage    = '0';
        $type               = 'purchase';
        $paymentOption      = ''; // Let PayWay show all enabled payment options

        // Hash fields must be concatenated in this exact order (empty strings included)
        $hashData = implode('', [
            $reqTime, $this->merchantId, $tranId, $amount, $items, $shipping,
            $firstname, $lastname, $order->customer_email, $phone,
            $type, $paymentOption,
            $returnUrl, $cancelUrl, $continueSuccessUrl, $returnDeeplink,
            $currency, $customFields, $returnParams,
            $lifetime, $additionalParams, $googlePayToken, $skipSuccessPage,
        ]);

        return array_filter([
            'action'               => "{$this->paywayUrl}/api/payment-gateway/v1/payments/purchase",
            'req_time'             => $reqTime,
            'merchant_id'          => $this->merchantId,
            'tran_id'              => $tranId,
            'amount'               => $amount,
            'items'                => $items,
            'shipping'             => $shipping,
            'firstname'            => $firstname,
            'lastname'             => $lastname,
            'email'                => $order->customer_email,
            'phone'                => $phone,
            'type'                 => $type,
            'payment_option'       => $paymentOption,
            'return_url'           => $returnUrl,
            'cancel_url'           => $cancelUrl,
            'continue_success_url' => $continueSuccessUrl,
            'return_deeplink'      => $returnDeeplink,
            'currency'             => $currency,
            'custom_fields'        => $customFields,
            'return_params'        => $returnParams,
            'lifetime'             => $lifetime,
            'additional_params'    => $additionalParams,
            'google_pay_token'     => $googlePayToken,
            'skip_success_page'    => $skipSuccessPage,
            'hash'                 => $this->sign($hashData),
        ], fn($v) => $v !== '' && $v !== null);
    }

    /**
     * Call PayWay check-transaction-2 and return the status result.
     */
    public function checkPaymentStatus(string $tranId): array
    {
        $reqTime  = now()->utc()->format('YmdHis');
        $hashData = $reqTime . $this->merchantId . $tranId;
        $hash     = $this->sign($hashData);

        try {
            $response = Http::timeout(15)
                ->asForm()
                ->post("{$this->paywayUrl}/api/payment-gateway/v1/payments/check-transaction-2", [
                    'req_time'    => $reqTime,
                    'merchant_id' => $this->merchantId,
                    'tran_id'     => $tranId,
                    'hash'        => $hash,
                ]);

            $data = $response->json();

            if (isset($data['status']['code']) && $data['status']['code'] === '00') {
                $tranStatus = $data['data']['tran_status'] ?? '';
                return [
                    'paid'   => $tranStatus === 'SUCCESS',
                    'status' => strtolower($tranStatus),
                    'raw'    => $data,
                ];
            }
        } catch (RequestException $e) {
            Log::error('ABA PayWay check-transaction error', [
                'message' => $e->getMessage(),
                'tran_id' => $tranId,
            ]);
        }

        return ['paid' => false, 'status' => 'unknown'];
    }

    /**
     * Verify the X_PAYWAY_HMAC_SHA512 header from a PayWay webhook callback.
     * Fields are sorted alphabetically by key, values concatenated, then HMAC-SHA512.
     */
    public function verifyWebhookSignature(Request $request): bool
    {
        $signature = $request->header('X_PAYWAY_HMAC_SHA512')
            ?? $request->header('X-PAYWAY-HMAC-SHA512');

        if (!$signature) {
            return false;
        }

        $postData = $request->except('hash');
        ksort($postData);
        $hashData = implode('', array_values($postData));
        $expected = $this->sign($hashData);

        return hash_equals($expected, $signature);
    }

    /**
     * Normalize a Cambodian phone number to PayWay's required format: 855XXXXXXXXX
     * Accepts: 0XX XXX XXX, +855XX..., 855XX...
     */
    private function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone); // strip everything except digits

        if (str_starts_with($digits, '855')) {
            return $digits;                          // already 855XXXXXXXXX
        }

        if (str_starts_with($digits, '0')) {
            return '855' . substr($digits, 1);       // 0XX → 855XX
        }

        return '855' . $digits;                      // bare local number
    }

    private function sign(string $data): string
    {
        return base64_encode(hash_hmac('sha512', $data, $this->apiKey, true));
    }
}
