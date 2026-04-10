<?php

use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\OrderController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\Shop\ServiceController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

// Public shop routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shop', [ProductController::class, 'index'])->name('shop.index');
Route::get('/shop/{slug}', [ProductController::class, 'show'])->name('shop.show');
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{slug}', [ServiceController::class, 'show'])->name('services.show');
Route::post('/services/{slug}/book', [ServiceController::class, 'book'])->name('services.book');

// Cart
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/{itemId}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{itemId}', [CartController::class, 'remove'])->name('cart.remove');

// Checkout
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/orders/{orderNumber}/confirmation', [OrderController::class, 'confirmation'])->name('orders.confirmation');

// Auth-protected account routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/account/orders', [AccountController::class, 'orders'])->name('account.orders');
    Route::get('/account/orders/{orderNumber}', [AccountController::class, 'orderDetail'])->name('account.orders.show');
});

// Webhooks (CSRF exempt via bootstrap/app.php)
Route::post('/webhooks/aba-pay', [WebhookController::class, 'abaPay'])->name('webhooks.aba');

require __DIR__.'/auth.php';
