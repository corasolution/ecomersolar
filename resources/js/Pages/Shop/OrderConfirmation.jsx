import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle, Clock, ShoppingBag, Loader2, XCircle } from 'lucide-react';

function AbaPayStatusSection({ order }) {
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15-min window

    // Poll payment status every 10 seconds
    useEffect(() => {
        if (paymentStatus === 'paid') return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/orders/${order.order_number}/payment-status`);
                const data = await res.json();
                if (data.paid) {
                    setPaymentStatus('paid');
                    clearInterval(interval);
                }
            } catch {}
        }, 10000);

        return () => clearInterval(interval);
    }, [order.order_number, paymentStatus]);

    // Countdown timer
    useEffect(() => {
        if (paymentStatus === 'paid' || timeLeft <= 0) return;
        const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, paymentStatus]);

    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');

    if (paymentStatus === 'paid') {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3 animate-bounce">🎉</div>
                <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                <p className="font-heading font-bold text-xl text-white mb-1">Payment Confirmed!</p>
                <p className="text-slate-400 text-sm">Your order is now being processed by our team.</p>
            </div>
        );
    }

    if (timeLeft <= 0) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="font-heading font-bold text-lg text-white mb-1">Session Expired</p>
                <p className="text-slate-400 text-sm mb-4">
                    If you completed payment, it will be confirmed shortly. Otherwise contact us.
                </p>
                <a
                    href="tel:+85512345678"
                    className="inline-block bg-solar-500 text-dark-900 font-bold px-6 py-2.5 rounded-xl"
                >
                    Call Us Now
                </a>
            </div>
        );
    }

    return (
        <div className="bg-dark-800 border border-slate-700/50 rounded-2xl p-6 text-center">
            <h2 className="font-heading font-bold text-xl text-white mb-1">Complete Your Payment</h2>
            <p className="text-slate-400 text-sm mb-6">
                You were redirected to ABA PayWay to complete your payment via ABA Pay or KHQR.
                Once paid, this page will update automatically.
            </p>

            <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="text-amber-400 font-medium text-sm">Waiting for payment confirmation…</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-6">
                <Clock className="w-4 h-4" />
                <span>Session expires in <span className="font-mono font-bold text-white">{minutes}:{seconds}</span></span>
            </div>

            <div className="text-xs text-slate-500">
                Didn't complete the payment?{' '}
                <Link href={route('cart.index')} className="text-solar-400 hover:underline">
                    Return to cart
                </Link>
            </div>
        </div>
    );
}

export default function OrderConfirmation({ order }) {
    const isAbaPay = order.payment_method === 'aba_pay';
    const isPaid   = order.payment_status === 'paid';

    return (
        <MainLayout>
            <Head title={`Order ${order.order_number} — SolaraKH`} />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    {(!isAbaPay || isPaid) && (
                        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    )}
                    <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mb-2">
                        {isAbaPay && !isPaid ? 'Awaiting Payment' : 'Order Received!'}
                    </h1>
                    <div className="inline-block bg-solar-500/10 border border-solar-500/30 text-solar-400 font-mono font-bold text-lg px-6 py-2.5 rounded-xl">
                        {order.order_number}
                    </div>
                    <p className="text-slate-400 text-sm mt-3">
                        Confirmation sent to <span className="text-white">{order.customer_email}</span>
                    </p>
                </div>

                {/* ABA Pay status section */}
                {isAbaPay && (
                    <div className="mb-8">
                        <AbaPayStatusSection order={order} />
                    </div>
                )}

                {/* Non-ABA payment instructions */}
                {!isAbaPay && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-8">
                        <p className="text-emerald-400 text-sm">
                            {order.payment_method === 'bank_transfer'
                                ? '💳 Please transfer the amount to ABA Bank: 000123456 (SolaraKH Co., Ltd) and send proof of payment to info@solarakh.com'
                                : '💵 Our team will contact you to arrange Cash on Delivery. Thank you!'}
                        </p>
                    </div>
                )}

                {/* Order Summary */}
                <div className="bg-dark-800 border border-slate-700/50 rounded-2xl overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-700/50">
                        <h2 className="font-heading font-bold text-white">Order Summary</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-2 mb-4">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-slate-300">
                                        {item.product_name}{' '}
                                        <span className="text-slate-500">×{item.quantity}</span>
                                    </span>
                                    <span className="text-white">${Number(item.subtotal).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-700 pt-3 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-white">${Number(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Shipping</span>
                                <span className={Number(order.shipping) === 0 ? 'text-emerald-400' : 'text-white'}>
                                    {Number(order.shipping) === 0 ? 'FREE' : `$${Number(order.shipping).toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-1">
                                <span className="text-white">Total</span>
                                <span className="text-solar-400">${Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href={route('shop.index')}
                        className="inline-flex items-center gap-2 border border-solar-500/50 text-solar-400 hover:bg-solar-500/10 font-semibold px-8 py-3 rounded-xl transition-all"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
