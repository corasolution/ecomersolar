import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle, ChevronRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const PROVINCES = [
    'Phnom Penh', 'Siem Reap', 'Sihanoukville', 'Battambang',
    'Kampong Cham', 'Kampong Speu', 'Takeo', 'Kandal', 'Other',
];

const STEPS = ['Customer Info', 'Payment Method', 'Review & Confirm'];

function StepIndicator({ current }) {
    return (
        <div className="flex items-center justify-center mb-10">
            {STEPS.map((step, i) => (
                <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className={clsx(
                            'w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all',
                            i < current ? 'bg-solar-500 text-dark-900' :
                            i === current ? 'bg-solar-500 text-dark-900 ring-4 ring-solar-500/30' :
                            'bg-dark-800 border border-slate-700 text-slate-400'
                        )}>
                            {i < current ? <CheckCircle className="w-5 h-5" /> : i + 1}
                        </div>
                        <span className={clsx(
                            'text-xs mt-1.5 font-medium whitespace-nowrap',
                            i <= current ? 'text-solar-400' : 'text-slate-500'
                        )}>{step}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={clsx(
                            'w-16 sm:w-24 h-0.5 mx-2 mb-5',
                            i < current ? 'bg-solar-500' : 'bg-slate-700'
                        )} />
                    )}
                </div>
            ))}
        </div>
    );
}

function Step1({ data, setData, errors }) {
    const field = (name, label, type = 'text', hint = null, required = true) => (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
                type={type}
                value={data[name] || ''}
                onChange={e => setData(name, e.target.value)}
                placeholder={hint}
                className={clsx(
                    'w-full bg-dark-900 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-solar-500',
                    errors[name] ? 'border-red-500' : 'border-slate-700'
                )}
            />
            {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <div className="space-y-4">
            <h2 className="font-heading font-bold text-xl text-white mb-6">Customer Information</h2>
            {field('full_name', 'Full Name', 'text', 'Your full name')}
            <div className="grid grid-cols-2 gap-4">
                {field('email', 'Email Address', 'email', 'you@example.com')}
                {field('phone', 'Phone Number', 'tel', '0XX XXX XXX')}
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Province / City <span className="text-red-400">*</span></label>
                <select
                    value={data.province || ''}
                    onChange={e => setData('province', e.target.value)}
                    className={clsx(
                        'w-full bg-dark-900 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-solar-500',
                        errors.province ? 'border-red-500' : 'border-slate-700'
                    )}
                >
                    <option value="">Select province...</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.province && <p className="text-red-400 text-xs mt-1">{errors.province}</p>}
            </div>
            {field('district', 'District / Khan', 'text', 'e.g. Chamkarmon', false)}
            {field('street_address', 'Street Address', 'text', 'Street name and number')}
            {field('house_number', 'House / Building Number', 'text', 'e.g. #45', false)}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Delivery Notes</label>
                <textarea
                    value={data.delivery_notes || ''}
                    onChange={e => setData('delivery_notes', e.target.value)}
                    rows={3}
                    placeholder="Special instructions for delivery..."
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-solar-500"
                />
            </div>
        </div>
    );
}

function Step2({ data, setData }) {
    const methods = [
        {
            id: 'aba_pay',
            label: 'ABA PAY',
            emoji: '🏦',
            desc: 'Scan QR or pay via ABA Mobile App',
            detail: null,
        },
        {
            id: 'bank_transfer',
            label: 'Bank Transfer',
            emoji: '🏛',
            desc: 'Transfer to SolaraKH bank account',
            detail: 'ABA Bank: 000123456 | Account: SolaraKH Co., Ltd',
        },
        {
            id: 'cod',
            label: 'Cash on Delivery',
            emoji: '💵',
            desc: 'Pay when your order arrives (Phnom Penh only)',
            detail: null,
        },
    ];

    return (
        <div>
            <h2 className="font-heading font-bold text-xl text-white mb-6">Payment Method</h2>
            <div className="space-y-3">
                {methods.map(m => (
                    <label key={m.id} className={clsx(
                        'flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all',
                        data.payment_method === m.id
                            ? 'border-solar-500 bg-solar-500/10'
                            : 'border-slate-700 bg-dark-800 hover:border-solar-500/50'
                    )}>
                        <input
                            type="radio"
                            name="payment_method"
                            value={m.id}
                            checked={data.payment_method === m.id}
                            onChange={() => setData('payment_method', m.id)}
                            className="mt-1 text-solar-500 focus:ring-solar-500"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{m.emoji}</span>
                                <span className="font-heading font-bold text-white">{m.label}</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-0.5">{m.desc}</p>
                            {m.detail && data.payment_method === m.id && (
                                <p className="mt-2 text-sm bg-dark-900 border border-slate-700 px-3 py-2 rounded-lg text-slate-300 font-mono">
                                    {m.detail}
                                </p>
                            )}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}

function Step3({ data, cartItems, cartTotal }) {
    const shipping = cartTotal >= 500 ? 0 : 10;
    const total = cartTotal + shipping;

    return (
        <div>
            <h2 className="font-heading font-bold text-xl text-white mb-6">Review Your Order</h2>

            {/* Items */}
            <div className="bg-dark-900 rounded-xl border border-slate-700/50 mb-5 overflow-hidden">
                {cartItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3 border-b border-slate-700/50 last:border-0 text-sm">
                        <span className="text-white">{item.name} <span className="text-slate-400">×{item.quantity}</span></span>
                        <span className="text-solar-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Delivery */}
            <div className="bg-dark-900 rounded-xl border border-slate-700/50 p-4 mb-5 text-sm">
                <h4 className="font-semibold text-white mb-2">Delivery Address</h4>
                <p className="text-slate-400">
                    {data.full_name}<br />
                    {data.house_number} {data.street_address}<br />
                    {data.district}, {data.province}<br />
                    📞 {data.phone}
                </p>
            </div>

            {/* Payment + Total */}
            <div className="bg-dark-900 rounded-xl border border-slate-700/50 p-4 text-sm">
                <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Payment</span>
                    <span className="text-white capitalize">{data.payment_method?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-3">
                    <span className="font-bold text-white">Grand Total</span>
                    <span className="font-bold text-xl text-solar-400">${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

export default function Checkout({ cartItems, cartTotal }) {
    const [step, setStep] = useState(0);
    const { data, setData, post, processing, errors } = useForm({
        full_name: '', email: '', phone: '', province: '', district: '',
        street_address: '', house_number: '', delivery_notes: '',
        payment_method: 'aba_pay',
    });

    const next = () => {
        if (step === 0) {
            // Basic client-side validation
            if (!data.full_name || !data.email || !data.phone || !data.province || !data.street_address) {
                return;
            }
        }
        setStep(s => Math.min(s + 1, 2));
    };

    const submit = () => {
        post(route('checkout.store'));
    };

    return (
        <MainLayout>
            <Head title="Checkout — SolaraKH" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
                <h1 className="font-heading font-black text-3xl text-white text-center mb-8">Checkout</h1>

                <StepIndicator current={step} />

                <div className="bg-dark-800 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
                    {step === 0 && <Step1 data={data} setData={setData} errors={errors} />}
                    {step === 1 && <Step2 data={data} setData={setData} />}
                    {step === 2 && <Step3 data={data} cartItems={cartItems} cartTotal={cartTotal} />}

                    <div className="flex gap-3 mt-8">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="flex-1 py-3.5 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:border-slate-600 transition-colors"
                            >
                                Back
                            </button>
                        )}

                        {step < 2 ? (
                            <button
                                onClick={next}
                                className="flex-1 flex items-center justify-center gap-2 bg-solar-500 hover:bg-solar-400 text-dark-900 font-bold py-3.5 rounded-xl transition-colors"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="flex-1 flex items-center justify-center gap-2 bg-solar-500 hover:bg-solar-400 disabled:bg-slate-700 text-dark-900 font-bold py-3.5 rounded-xl transition-colors"
                            >
                                {processing ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
