<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: #f59e0b; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .body { padding: 32px; }
        .info-box { background: #f8fafc; border-radius: 6px; padding: 16px; margin: 16px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 16px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>☀️ Booking Confirmed</h1>
    </div>
    <div class="body">
        <p>Dear {{ $booking->customer_name }},</p>
        <p>Your service booking has been received. Our team will contact you to confirm the appointment.</p>

        <div class="info-box">
            <p><strong>Booking Reference:</strong> {{ $booking->booking_reference }}</p>
            <p><strong>Service:</strong> {{ $booking->service->name }}</p>
            <p><strong>Date:</strong> {{ $booking->preferred_date->format('F d, Y') }}</p>
            <p><strong>Time Slot:</strong> {{ $booking->time_slot === 'morning' ? 'Morning (8AM–12PM)' : 'Afternoon (1PM–5PM)' }}</p>
            <p><strong>Address:</strong> {{ $booking->installation_address }}</p>
            @if($booking->estimated_price > 0)
            <p><strong>Estimated Price:</strong> ${{ number_format($booking->estimated_price, 2) }}</p>
            @endif
        </div>

        <p>If you need to reschedule or have questions, please contact us at:<br>
        📧 <a href="mailto:support@solarakh.com">support@solarakh.com</a><br>
        📞 +855 12 345 678</p>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} SolaraKH — Phnom Penh, Cambodia
    </div>
</div>
</body>
</html>
