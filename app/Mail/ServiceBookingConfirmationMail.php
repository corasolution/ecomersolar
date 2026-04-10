<?php

namespace App\Mail;

use App\Models\ServiceBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ServiceBookingConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly ServiceBooking $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Booking Confirmed — {$this->booking->booking_reference} | SolaraKH",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.service-booking-confirmation',
        );
    }
}
