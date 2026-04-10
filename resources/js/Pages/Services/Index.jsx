import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Sun, ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const processSteps = [
    { step: 1, title: 'Site Survey', desc: 'Our expert visits your property to assess solar potential and energy needs.' },
    { step: 2, title: 'System Design', desc: 'We design a custom solar system optimized for your specific requirements.' },
    { step: 3, title: 'Installation', desc: 'Certified technicians install your system to the highest safety standards.' },
    { step: 4, title: 'Testing & Commission', desc: 'Full system testing and monitoring setup before handover.' },
];

const faqs = [
    {
        q: 'How long does installation take?',
        a: 'Residential installations (1–10kW) typically take 1–3 days. Commercial systems depend on size and complexity — our team will give you a precise timeline after the site survey.',
    },
    {
        q: 'What warranty do you provide on installation?',
        a: 'We provide a 2-year workmanship warranty on all installations. Panel and inverter warranties are provided directly by manufacturers (25yr and 10yr respectively).',
    },
    {
        q: 'Can I monitor my system remotely?',
        a: 'Yes! All our systems are configured with remote monitoring apps (SolarEdge, SunSmart, or ShinePhone depending on your inverter). Monitor production, consumption, and savings in real time.',
    },
    {
        q: 'Do you handle permits and approvals?',
        a: 'Yes — we handle all grid connection paperwork, EDC approvals (for on-grid systems), and any required permits as part of our installation service.',
    },
    {
        q: 'What happens after the warranty period?',
        a: 'We offer affordable extended maintenance plans. Solar panels typically last 30+ years with minimal degradation. Our team remains available for repairs and upgrades even after warranty.',
    },
    {
        q: 'Do you service systems not installed by you?',
        a: 'Yes! Our System Health Check and Maintenance services are available for any solar installation in Cambodia. We can diagnose issues and bring underperforming systems back to peak output.',
    },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-slate-700/50 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-700/50 transition-colors"
            >
                <span className="font-medium text-white pr-4">{q}</span>
                <ChevronDown className={clsx('w-5 h-5 text-solar-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
            </button>
            {open && (
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                    {a}
                </div>
            )}
        </div>
    );
}

export default function ServicesIndex({ services }) {
    return (
        <MainLayout>
            <Head title="Solar Services — SolaraKH" />

            {/* Hero */}
            <section className="relative bg-dark-950 py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-solar-500/5 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 bg-solar-500/10 border border-solar-500/20 text-solar-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
                        <Sun className="w-4 h-4" />
                        Professional Solar Services
                    </span>
                    <h1 className="font-heading font-black text-4xl sm:text-5xl text-white mb-6">
                        Professional Solar<br />
                        <span className="bg-gradient-to-r from-solar-300 to-solar-600 bg-clip-text text-transparent">
                            Installation & Maintenance
                        </span>
                        <br />in Cambodia
                    </h1>
                    <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                        From residential rooftops to commercial solar farms — our certified team delivers quality installations across the Kingdom.
                    </p>
                    <Link
                        href={route('services.show', 'free-solar-consultation')}
                        className="inline-flex items-center gap-2 bg-solar-500 hover:bg-solar-400 text-dark-900 font-bold px-8 py-4 rounded-xl transition-colors"
                    >
                        Get Free Quote
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="bg-dark-800 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-solar-500/40 transition-all group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-solar-500/10 rounded-xl flex items-center justify-center group-hover:bg-solar-500/20 transition-colors">
                                        <Sun className="w-6 h-6 text-solar-400" />
                                    </div>
                                    <div className="text-right">
                                        <p className="font-heading font-bold text-solar-400 text-lg">
                                            {Number(service.base_price) === 0
                                                ? 'FREE'
                                                : `$${Number(service.base_price).toFixed(0)}${service.price_unit === 'per_kw' ? '/kW' : ''}`}
                                        </p>
                                        {service.duration && (
                                            <p className="text-slate-500 text-xs">{service.duration}</p>
                                        )}
                                    </div>
                                </div>

                                <h3 className="font-heading font-bold text-xl text-white mb-2">{service.name}</h3>
                                <p className="text-slate-400 text-sm mb-5">{service.short_description}</p>

                                {service.features && service.features.length > 0 && (
                                    <ul className="space-y-2 mb-6">
                                        {service.features.slice(0, 4).map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                <CheckCircle className="w-4 h-4 text-solar-400 flex-shrink-0 mt-0.5" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <Link
                                    href={route('services.show', service.slug)}
                                    className="flex items-center justify-center gap-2 bg-solar-500 hover:bg-solar-400 text-dark-900 font-bold py-3 rounded-xl transition-colors w-full"
                                >
                                    Book Now
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process */}
            <section className="py-16 bg-dark-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-heading font-bold text-3xl text-white mb-3">How It Works</h2>
                        <p className="text-slate-400">Simple 4-step process from first contact to going solar</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {processSteps.map((s, i) => (
                            <div key={i} className="relative">
                                {i < processSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-7 left-1/2 w-full h-0.5 bg-solar-500/20" />
                                )}
                                <div className="relative bg-dark-800 border border-slate-700/50 rounded-2xl p-5 text-center">
                                    <div className="w-12 h-12 bg-solar-500 text-dark-900 rounded-full flex items-center justify-center font-heading font-black text-lg mx-auto mb-3">
                                        {s.step}
                                    </div>
                                    <h3 className="font-heading font-bold text-white mb-2">{s.title}</h3>
                                    <p className="text-slate-400 text-sm">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h2 className="font-heading font-bold text-3xl text-white mb-3">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <FaqItem key={i} q={faq.q} a={faq.a} />
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
