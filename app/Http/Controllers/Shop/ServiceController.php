<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Mail\ServiceBookingConfirmationMail;
use App\Models\Service;
use App\Models\ServiceBooking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $services = Service::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($s) => [
                'id'                => $s->id,
                'name'              => $s->name,
                'slug'              => $s->slug,
                'short_description' => $s->short_description,
                'image'             => $s->image,
                'base_price'        => $s->base_price,
                'price_unit'        => $s->price_unit,
                'duration'          => $s->duration,
                'features'          => $s->features ?? [],
            ]);

        return Inertia::render('Services/Index', ['services' => $services]);
    }

    public function show(string $slug): Response
    {
        $service = Service::where('slug', $slug)->where('is_active', true)->firstOrFail();

        return Inertia::render('Services/Booking', [
            'service' => [
                'id'                => $service->id,
                'name'              => $service->name,
                'slug'              => $service->slug,
                'short_description' => $service->short_description,
                'base_price'        => $service->base_price,
                'price_unit'        => $service->price_unit,
                'duration'          => $service->duration,
                'features'          => $service->features ?? [],
            ],
        ]);
    }

    public function book(Request $request, string $slug): RedirectResponse
    {
        $service = Service::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $validated = $request->validate([
            'customer_name'        => 'required|string|max:255',
            'customer_email'       => 'required|email|max:255',
            'customer_phone'       => 'required|string|max:20',
            'installation_address' => 'required|string|max:500',
            'preferred_date'       => 'required|date|after:today',
            'time_slot'            => 'required|in:morning,afternoon',
            'system_size_kw'       => 'nullable|numeric|min:1|max:500',
            'additional_notes'     => 'nullable|string|max:1000',
        ]);

        $estimatedPrice = null;
        if ($service->price_unit === 'per_kw' && !empty($validated['system_size_kw'])) {
            $estimatedPrice = $service->base_price * $validated['system_size_kw'];
        } elseif ($service->price_unit === 'flat') {
            $estimatedPrice = $service->base_price;
        }

        $booking = ServiceBooking::create([
            'booking_reference'    => ServiceBooking::generateReference(),
            'service_id'           => $service->id,
            'user_id'              => auth()->id(),
            'customer_name'        => $validated['customer_name'],
            'customer_email'       => $validated['customer_email'],
            'customer_phone'       => $validated['customer_phone'],
            'installation_address' => $validated['installation_address'],
            'preferred_date'       => $validated['preferred_date'],
            'time_slot'            => $validated['time_slot'],
            'system_size_kw'       => $validated['system_size_kw'] ?? null,
            'estimated_price'      => $estimatedPrice,
            'additional_notes'     => $validated['additional_notes'] ?? null,
            'status'               => 'pending',
        ]);

        Mail::to($booking->customer_email)->queue(new ServiceBookingConfirmationMail($booking));

        return back()->with('success', "Booking received! Your reference is {$booking->booking_reference}.");
    }
}
