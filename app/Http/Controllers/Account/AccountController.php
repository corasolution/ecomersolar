<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function orders(Request $request): Response
    {
        $orders = Order::where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(fn($o) => [
                'id'             => $o->id,
                'order_number'   => $o->order_number,
                'total'          => $o->total,
                'payment_status' => $o->payment_status,
                'order_status'   => $o->order_status,
                'items_count'    => $o->items()->count(),
                'created_at'     => $o->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Account/Orders', ['orders' => $orders]);
    }

    public function orderDetail(string $orderNumber): Response
    {
        $order = Order::with('items')
            ->where('user_id', auth()->id())
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return Inertia::render('Account/OrderDetail', [
            'order' => [
                'id'             => $order->id,
                'order_number'   => $order->order_number,
                'customer_name'  => $order->customer_name,
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'province'       => $order->province,
                'district'       => $order->district,
                'street_address' => $order->street_address,
                'house_number'   => $order->house_number,
                'delivery_notes' => $order->delivery_notes,
                'subtotal'       => $order->subtotal,
                'shipping'       => $order->shipping,
                'total'          => $order->total,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'order_status'   => $order->order_status,
                'created_at'     => $order->created_at->format('M d, Y H:i'),
                'items'          => $order->items->map(fn($i) => [
                    'product_name' => $i->product_name,
                    'unit_price'   => $i->unit_price,
                    'quantity'     => $i->quantity,
                    'subtotal'     => $i->subtotal,
                ]),
            ],
        ]);
    }
}
