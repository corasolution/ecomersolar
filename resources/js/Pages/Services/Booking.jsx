import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import clsx from 'clsx';

export default function ServiceBooking({ service }) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);

    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        installation_address: '',
        preferred_date: '',
        time_slot: 'morning',
        system_size_kw: '',
        additional_notes: '',
    });

    const estimatedTotal = useMemo(() => {
        if (service.price_unit === 'per_kw' && data.system_size_kw) {
            return (parseFloat(service.base_price) * parseFloat(data.system_size_kw)).toFixed(2);
        }
        if (service.price_unit === 'flat') {
            return parseFloat(service.base_price).toFixed(2);
        }
        return null;
    }, [service, data.system_size_kw]);

    const isDateDisabled = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d.getDay() === 0; // Sunday
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('services.book', service.slug));
    };

    const field = (name, label, type = 'text', hint = '', required = true) => (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
                type={type}
                value={data[name] || ''}
                onChange={e => setData(name, e.target.value)}
                placeholder={hint}
                min={type === 'date' ? minDate.toISOString().split('T')[0] : undefined}
                className={clsx(
                    'w-full bg-dark-900 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-solar-500',
                    errors[name] ? 'border-red-500' : 'border-slate-700'
                )}
            />
            {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    if (wasSuccessful) {
        return (
            <MainLayout>
                <Head title={`Booking Confirmed — SolaraKH`} />
                <div className="max-w-lg mx-auto px-4 py-20 text-center">
                    <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto mb-6" />
                    <h1 className="font-heading font-black text-3xl text-white mb-3">Booking Received!</h1>
                    <p className="text-slate-400">We'll contact you within 24 hours to confirm your appointment. Check your email for the booking reference.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={`Book ${service.name} — SolaraKH`} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="font-heading font-bold text-3xl text-white mb-8">Book a Service</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Service Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-dark-800 border border-slate-700/50 rounded-2xl p-6 sticky top-24">
                            <h2 className="font-heading font-bold text-white text-lg mb-1">{service.name}</h2>
                            <p className="text-slate-400 text-sm mb-5">{service.short_description}</p>

                            <div className="mb-5">
                                <span className="text-solar-400 font-heading font-bold text-2xl">
                                    {parseFloat(service.base_price) === 0
                                        ? 'FREE'
                                        : `$${Number(service.base_price).toFixed(0)}${service.price_unit === 'per_kw' ? '/kW' : ''}`}
                                </span>
                            </div>

                            {service.features && (
                                <ul className="space-y-2">
                                    {service.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-solar-400 flex-shrink-0 mt-0.5" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {estimatedTotal && (
                                <div className="mt-5 bg-solar-500/10 border border-solar-500/20 rounded-xl p-4">
                                    <p className="text-xs text-slate-400 mb-1">Estimated Total</p>
                                    <p className="font-heading font-bold text-xl text-solar-400">${estimatedTotal}</p>
                                    <p className="text-xs text-slate-500 mt-1">*Final price confirmed after site survey</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="bg-dark-800 border border-slate-700/50 rounded-2xl p-6 sm:p-8 space-y-5">
                            {field('customer_name', 'Your Name', 'text', 'Full name')}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {field('customer_email', 'Email', 'email', 'you@example.com')}
                                {field('customer_phone', 'Phone', 'tel', '0XX XXX XXX')}
                            </div>
                            {field('installation_address', 'Installation Address', 'text', 'Full address where solar will be installed')}

                            <div className="grid sm:grid-cols-2 gap-4">
                                {field('preferred_date', 'Preferred Date', 'date')}

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Time Slot <span className="text-red-400">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { val: 'morning', label: '🌅 Morning', sub: '8AM–12PM' },
                                            { val: 'afternoon', label: '☀️ Afternoon', sub: '1PM–5PM' },
                                        ].map(opt => (
                                            <label key={opt.val} className={clsx(
                                                'flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all text-center',
                                                data.time_slot === opt.val
                                                    ? 'border-solar-500 bg-solar-500/10'
                                                    : 'border-slate-700 hover:border-solar-500/50'
                                            )}>
                                                <input
                                                    type="radio"
                                                    className="sr-only"
                                                    value={opt.val}
                                                    checked={data.time_slot === opt.val}
                                                    onChange={() => setData('time_slot', opt.val)}
                                                />
                                                <span className="text-lg">{opt.label.split(' ')[0]}</span>
                                                <span className="text-xs text-white font-medium">{opt.label.split(' ')[1]}</span>
                                                <span className="text-xs text-slate-400">{opt.sub}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {service.price_unit === 'per_kw' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Estimated System Size (kW)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="500"
                                        step="0.5"
                                        value={data.system_size_kw}
                                        onChange={e => setData('system_size_kw', e.target.value)}
                                        placeholder="e.g. 5"
                                        className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-solar-500"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Not sure? We'll calculate it during the site survey.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Additional Notes</label>
                                <textarea
                                    value={data.additional_notes}
                                    onChange={e => setData('additional_notes', e.target.value)}
                                    rows={4}
                                    placeholder="Anything else we should know? Current electricity bill, roof type, shading issues..."
                                    className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-solar-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-solar-500 hover:bg-solar-400 disabled:bg-slate-700 text-dark-900 font-bold py-4 rounded-xl transition-colors"
                            >
                                {processing ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Booking...</>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
