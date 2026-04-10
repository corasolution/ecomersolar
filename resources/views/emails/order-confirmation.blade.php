<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: #f59e0b; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .body { padding: 32px; }
        .order-number { font-size: 22px; font-weight: bold; color: #1e293b; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 13px; color: #64748b; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .total { font-weight: bold; font-size: 18px; color: #1e293b; }
        .footer { background: #1e293b; color: #94a3b8; padding: 16px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>☀️ SolaraKH</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 4px 0 0;">Order Confirmation</p>
    </div>
    <div class="body">
        <p>Dear {{ $order->customer_name }},</p>
        <p>Thank you for your order! We've received your request and are processing it now.</p>

        <div class="order-number">{{ $order->order_number }}</div>

        @if($order->payment_method === 'aba_pay')
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin: 16px 0;">
            <strong>⚠️ Action Required:</strong> Please complete your payment via ABA Mobile App. Check your order confirmation page for the QR code.
        </div>
        @endif

        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->subtotal, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table>
            <tr><td>Subtotal</td><td>${{ number_format($order->subtotal, 2) }}</td></tr>
            <tr><td>Shipping</td><td>{{ $order->shipping > 0 ? '$'.$order->shipping : 'FREE' }}</td></tr>
            <tr><td class="total">Total</td><td class="total">${{ number_format($order->total, 2) }}</td></tr>
        </table>

        <p><strong>Delivery Address:</strong><br>
        {{ $order->house_number }} {{ $order->street_address }},<br>
        {{ $order->district }}, {{ $order->province }}</p>

        <p>If you have any questions, contact us at <a href="mailto:support@solarakh.com">support@solarakh.com</a></p>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} SolaraKH — Phnom Penh, Cambodia
    </div>
</div>
</body>
</html>
