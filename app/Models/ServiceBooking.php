<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceBooking extends Model
{
    protected $fillable = [
        'booking_reference', 'service_id', 'user_id', 'customer_name',
        'customer_email', 'customer_phone', 'installation_address',
        'preferred_date', 'time_slot', 'system_size_kw', 'estimated_price',
        'additional_notes', 'status',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'system_size_kw' => 'decimal:2',
        'estimated_price' => 'decimal:2',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function generateReference(): string
    {
        return 'BK-' . strtoupper(substr(uniqid(), -8));
    }
}
