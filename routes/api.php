<?php

use App\Http\Controllers\Shop\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('/orders/{orderNumber}/payment-status', [OrderController::class, 'paymentStatus']);
