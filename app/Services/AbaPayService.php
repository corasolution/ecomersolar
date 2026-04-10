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
     * Create a hosted PayWay checkout and return the checkout URL.
     * Returns null on failure (fallback to COD handling in controller).
     */
    public function createPayment(Order $order): ?string
    {
        $reqTime  = now()->utc()->format('YmdHis');
        $tranId   = $order->order_number;
        $amount   = number_format((float) $order->total, 2, '.', '');
        $shipping = number_format((float) $order->shipping, 2, '.', '');

        // Build items JSON expected by PayWay
        $items = $order->items->map(fn($i) => [
            'name'     => $i->product_name,
            'quantity' => (int) $i->quantity,
            'price'    => number_format((float) $i->unit_price, 2, '.', ''),
        ])->values()->toJson();

        // Split customer name into firstname / lastname
        $nameParts = explode(' ', trim($order->customer_name), 2);
        $firstname = $nameParts[0] ?? $order->customer_name;
        $lastname  = $nameParts[1] ?? '';

        $returnUrl           = route('orders.confirmation', $order->order_number);
        $cancelUrl           = route('cart.index');
        $continueSuccessUrl  = $returnUrl;
        $returnDeeplink      = '';
        $currency            = 'USD';
        $customFields        = '';
        $returnParams        = '';
        $payout              = '0';
        $lifetime            = '15';       // minutes the checkout is valid
        $additionalParams    = '';
        $googlePayToken      = '';
        $skipSuccessPage     = '0';
        $type                = 'purchase';
        $paymentOption       = 'abapay_khqr'; // ABA Pay + KHQR QR on PayWay's page

        // Hash fields must be concatenated in this exact order (empty strings included)
        $hashData = implode('', [
            $reqTime, $this->merchantId, $tranId, $amount, $items, $shipping,
            $firstname, $lastname, $order->customer_email, $order->customer_phone,
            $type, $paymentOption,
            $returnUrl, $cancelUrl, $continueSuccessUrl, $returnDeeplink,
            $currency, $customFields, $returnParams,
            $payout, $lifetime, $additionalParams, $googlePayToken, $skipSuccessPage,
        ]);

        $hash = $this->sign($hashData);

        $payload = [
            'req_time'             => $reqTime,
            'merchant_id'          => $this->merchantId,
            'tran_id'              => $tranId,
            'amount'               => $amount,
            'items'                => $items,
            'shipping'             => $shipping,
            'firstname'            => $firstname,
            'lastname'             => $lastname,
            'email'                => $order->customer_email,
            'phone'                => $order->customer_phone,
            'type'                 => $type,
            'payment_option'       => $paymentOption,
            'return_url'           => $returnUrl,
            'cancel_url'           => $cancelUrl,
            'continue_success_url' => $continueSuccessUrl,
            'return_deeplink'      => $returnDeeplink,
            'currency'             => $currency,
            'custom_fields'        => $customFields,
            'return_params'        => $returnParams,
            'payout'               => $payout,
            'lifetime'             => $lifetime,
            'additional_params'    => $additionalParams,
            'google_pay_token'     => $googlePayToken,
            'skip_success_page'    => $skipSuccessPage,
            'hash'                 => $hash,
        ];

        try {
            $response = Http::timeout(30)
                ->asForm()
                ->post("{$this->paywayUrl}/api/payment-gateway/v1/payments/purchase", $payload);

            $data = $response->json();

            if (isset($data['status']['code']) && $data['status']['code'] === '00') {
                $checkoutUrl = $data['checkout_url'] ?? $data['data']['checkout_url'] ?? null;
                if ($checkoutUrl) {
                    return $checkoutUrl;
                }
            }

            Log::error('ABA PayWay purchase failed', [
                'status'   => $response->status(),
                'response' => $data,
                'order'    => $order->order_number,
            ]);
        } catch (RequestException $e) {
            Log::error('ABA PayWay HTTP error', [
                'message' => $e->getMessage(),
                'order'   => $order->order_number,
            ]);
        }

        return null;
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

    private function sign(string $data): string
    {
        return base64_encode(hash_hmac('sha512', $data, $this->apiKey, true));
    }
}
