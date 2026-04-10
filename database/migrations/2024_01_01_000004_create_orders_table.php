<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('province');
            $table->string('district')->nullable();
            $table->text('street_address');
            $table->string('house_number')->nullable();
            $table->text('delivery_notes')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('payment_method'); // aba_pay, bank_transfer, cod
            $table->string('payment_status')->default('pending'); // pending, paid, failed
            $table->string('order_status')->default('new'); // new, confirmed, processing, shipped, delivered, cancelled
            $table->string('aba_qr_string')->nullable();
            $table->string('aba_transaction_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
