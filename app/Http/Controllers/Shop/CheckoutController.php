<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\AbaPayService;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        if (CartService::isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        return Inertia::render('Shop/Checkout', [
            'cartItems' => CartService::getItems(),
            'cartTotal' => CartService::getTotal(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name'      => 'required|string|max:255',
            'email'          => 'required|email|max:255',
            'phone'          => 'required|string|max:20',
            'province'       => 'required|string|max:100',
            'district'       => 'nullable|string|max:100',
            'street_address' => 'required|string|max:500',
            'house_number'   => 'nullable|string|max:50',
            'delivery_notes' => 'nullable|string|max:500',
            'payment_method' => 'required|in:aba_pay,bank_transfer,cod',
        ]);

        if (CartService::isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $items = CartService::getItems();
        $subtotal = CartService::getTotal();
        $shipping = $subtotal >= 500 ? 0 : 10;
        $total = $subtotal + $shipping;

        $order = Order::create([
            'order_number'   => Order::generateOrderNumber(),
            'user_id'        => auth()->id(),
            'customer_name'  => $validated['full_name'],
            'customer_email' => $validated['email'],
            'customer_phone' => $validated['phone'],
            'province'       => $validated['province'],
            'district'       => $validated['district'] ?? null,
            'street_address' => $validated['street_address'],
            'house_number'   => $validated['house_number'] ?? null,
            'delivery_notes' => $validated['delivery_notes'] ?? null,
            'subtotal'       => $subtotal,
            'shipping'       => $shipping,
            'total'          => $total,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'order_status'   => 'new',
        ]);

        foreach ($items as $item) {
            OrderItem::create([
                'order_id'     => $order->id,
                'product_id'   => $item['product_id'],
                'product_name' => $item['name'],
                'product_sku'  => $item['sku'],
                'unit_price'   => $item['price'],
                'quantity'     => $item['quantity'],
                'subtotal'     => $item['price'] * $item['quantity'],
            ]);
        }

        CartService::clear();

        Mail::to($order->customer_email)->queue(new OrderConfirmationMail($order));

        if ($validated['payment_method'] === 'aba_pay') {
            // Load items relation for the PayWay items field
            $order->load('items');
            $checkoutUrl = app(AbaPayService::class)->createPayment($order);

            if ($checkoutUrl) {
                return redirect()->away($checkoutUrl);
            }

            // PayWay unavailable — fall through to confirmation with a warning
            return redirect()->route('orders.confirmation', $order->order_number)
                ->with('error', 'Payment gateway temporarily unavailable. Please contact us to complete payment.');
        }

        return redirect()->route('orders.confirmation', $order->order_number);
    }
}
