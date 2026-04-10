<?php

namespace App\Http\Controllers;

use App\Events\OrderPaid;
use App\Models\Order;
use App\Services\AbaPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function abaPay(Request $request): JsonResponse
    {
        $abaPayService = app(AbaPayService::class);

        if (!$abaPayService->verifyWebhookSignature($request)) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        // PayWay callback uses tran_id (our order_number) and status (SUCCESS/FAILED/etc.)
        $transactionId = $request->input('tran_id');
        $abaTranId     = $request->input('aba_tran');   // ABA's own transaction reference
        $status        = $request->input('status');      // "SUCCESS", "FAILED", etc.

        if ($status === 'SUCCESS' && $transactionId) {
            $order = Order::where('order_number', $transactionId)->first();

            if ($order && $order->payment_status !== 'paid') {
                $order->update([
                    'payment_status'     => 'paid',
                    'order_status'       => 'confirmed',
                    'aba_transaction_id' => $abaTranId ?? $transactionId,
                    'paid_at'            => now(),
                ]);

                event(new OrderPaid($order));
            }
        }

        // PayWay expects a plain "OK" 200 response
        return response()->json(['message' => 'OK']);
    }
}
