<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\AbaPayService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function confirmation(string $orderNumber): Response
    {
        $order = Order::with('items')->where('order_number', $orderNumber)->firstOrFail();

        return Inertia::render('Shop/OrderConfirmation', [
            'order' => [
                'id'             => $order->id,
                'order_number'   => $order->order_number,
                'customer_name'  => $order->customer_name,
                'customer_email' => $order->customer_email,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'order_status'   => $order->order_status,
                'subtotal'       => $order->subtotal,
                'shipping'       => $order->shipping,
                'total'          => $order->total,
                'items'          => $order->items->map(fn($i) => [
                    'product_name' => $i->product_name,
                    'product_sku'  => $i->product_sku,
                    'unit_price'   => $i->unit_price,
                    'quantity'     => $i->quantity,
                    'subtotal'     => $i->subtotal,
                ]),
                'created_at' => $order->created_at->format('M d, Y H:i'),
            ],
            'qrString' => $order->aba_qr_string,
        ]);
    }

    public function paymentStatus(string $orderNumber): JsonResponse
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        // If already marked paid in our DB, return immediately
        if ($order->payment_status === 'paid') {
            return response()->json(['paid' => true, 'status' => 'paid']);
        }

        // For ABA Pay orders, check live status from PayWay
        if ($order->payment_method === 'aba_pay') {
            $result = app(AbaPayService::class)->checkPaymentStatus($order->order_number);

            if ($result['paid']) {
                $order->update([
                    'payment_status' => 'paid',
                    'order_status'   => 'confirmed',
                    'paid_at'        => now(),
                ]);
                return response()->json(['paid' => true, 'status' => 'paid']);
            }
        }

        return response()->json([
            'paid'   => false,
            'status' => $order->payment_status,
        ]);
    }
}
