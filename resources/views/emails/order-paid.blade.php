<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Confirmed</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: #22c55e; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .body { padding: 32px; }
        .footer { background: #1e293b; color: #94a3b8; padding: 16px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>✅ Payment Confirmed!</h1>
    </div>
    <div class="body">
        <p>Dear {{ $order->customer_name }},</p>
        <p>Great news! Your payment for order <strong>{{ $order->order_number }}</strong> has been received and confirmed.</p>
        <p><strong>Total Paid:</strong> ${{ number_format($order->total, 2) }}</p>
        <p>Your order is now being processed and we'll contact you within 1-2 business days to arrange delivery and/or installation.</p>
        <p>Estimated processing time: <strong>2-5 business days</strong></p>
        <p>Thank you for choosing SolaraKH! ☀️</p>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} SolaraKH — Phnom Penh, Cambodia
    </div>
</div>
</body>
</html>
