import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/Shop/ProductCard';
import { ArrowRight, CheckCircle, Sun, Shield, Award, Headphones, Star, ChevronRight } from 'lucide-react';

const stats = [
    { label: '500+ Installations', icon: '🏗️' },
    { label: '15yr Avg Warranty', icon: '🛡️' },
    { label: '24/7 Support', icon: '📞' },
    { label: 'ABA PAY Accepted', icon: '💳' },
];

const whyUs = [
    { icon: <Shield className="w-8 h-8" />, title: 'Quality Products', desc: 'Tier-1 solar panels and inverters from globally certified manufacturers.' },
    { icon: <Award className="w-8 h-8" />, title: 'Professional Install', desc: 'Certified technicians with 5+ years of solar installation experience in Cambodia.' },
    { icon: <CheckCircle className="w-8 h-8" />, title: 'Long Warranty', desc: 'Up to 25 years panel warranty and 10 years on inverters — backed by manufacturers.' },
    { icon: <Headphones className="w-8 h-8" />, title: 'Local Support', desc: 'Based in Phnom Penh. Fast on-site support across all provinces of Cambodia.' },
];

const testimonials = [
    {
        name: 'Sopheap Meas',
        role: 'Homeowner, Phnom Penh',
        text: 'Installed a 5kW system last year. Electricity bill dropped by 85%. The SolaraKH team was professional and completed in 2 days.',
        stars: 5,
    },
    {
        name: 'Dara Chhun',
        role: 'Factory Owner, Siem Reap',
        text: 'We installed 50kW for our garment factory. ROI expected in 3 years. Excellent project management and after-sales service.',
        stars: 5,
    },
    {
        name: 'Panha Keo',
        role: 'Restaurant Owner, Sihanoukville',
        text: 'ABA PAY checkout made ordering easy. Panels delivered and installed within the week. Highly recommend SolaraKH!',
        stars: 5,
    },
];

export default function Home({ featuredProducts, services }) {
    return (
        <MainLayout>
            <Head title="SolaraKH — Cambodia Solar Energy Solutions" />

            {/* Hero */}
            <section className="relative min-h-screen flex items-center bg-dark-950 overflow-hidden">
                {/* Background gradients */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-solar-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-solar-600/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-solar-500/10 border border-solar-500/20 text-solar-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
                                <Sun className="w-4 h-4" />
                                Cambodia's #1 Solar Provider
                            </span>

                            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
                                <span className="bg-gradient-to-r from-solar-300 via-solar-400 to-solar-600 bg-clip-text text-transparent">
                                    Power Your Future
                                </span>
                                <br />
                                <span className="text-white">with Solar Energy</span>
                            </h1>

                            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
                                Cambodia's trusted solar energy partner. Premium panels, professional installation, and
                                lifetime support — making clean energy accessible across the Kingdom.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={route('shop.index')}
                                    className="flex items-center gap-2 bg-solar-500 hover:bg-solar-400 text-dark-900 font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-solar-500/30"
                                >
                                    Shop Products
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href={route('services.index')}
                                    className="flex items-center gap-2 border border-solar-500/50 text-solar-400 hover:bg-solar-500/10 font-semibold px-8 py-3.5 rounded-xl transition-all"
                                >
                                    View Services
                                </Link>
                            </div>
                        </div>

                        {/* Solar panel illustration */}
                        <div className="hidden lg:flex justify-center">
                            <div className="relative">
                                <div className="w-80 h-80 bg-gradient-to-br from-solar-500/20 to-solar-900/20 rounded-3xl border border-solar-500/20 flex items-center justify-center">
                                    <div className="grid grid-cols-3 gap-2 p-8">
                                        {Array.from({length: 9}).map((_, i) => (
                                            <div key={i} className="aspect-square bg-gradient-to-br from-solar-800/80 to-dark-900 rounded-lg border border-solar-600/30 shadow-inner" />
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 bg-solar-500 text-dark-900 font-heading font-bold text-sm px-4 py-2 rounded-xl shadow-lg shadow-solar-500/30">
                                    550W Panel
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-dark-800 border border-solar-500/30 text-white text-sm px-4 py-2 rounded-xl">
                                    ⚡ 21.3% Efficiency
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats bar */}
            <section className="bg-gradient-to-r from-solar-600 to-solar-500 py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {stats.map((s, i) => (
                            <div key={i} className="flex items-center justify-center gap-2">
                                <span className="text-xl">{s.icon}</span>
                                <span className="font-heading font-bold text-dark-900 text-sm sm:text-base">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="font-heading font-bold text-3xl text-white mb-2">Featured Products</h2>
                        <p className="text-slate-400">Top-rated solar equipment trusted by 500+ Cambodian customers</p>
                    </div>
                    <Link href={route('shop.index')} className="flex items-center gap-1 text-solar-400 hover:text-solar-300 text-sm font-medium">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Services Preview */}
            <section className="py-20 bg-dark-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-heading font-bold text-3xl text-white mb-3">Our Services</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Professional solar installation, maintenance, and consultation across Cambodia</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {services.map(service => (
                            <div key={service.id} className="bg-dark-800 border border-slate-700/50 rounded-2xl p-6 hover:border-solar-500/40 transition-all group">
                                <div className="w-12 h-12 bg-solar-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-solar-500/20 transition-colors">
                                    <Sun className="w-6 h-6 text-solar-400" />
                                </div>
                                <h3 className="font-heading font-bold text-white text-lg mb-2">{service.name}</h3>
                                <p className="text-slate-400 text-sm mb-4">{service.short_description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-solar-400 font-semibold">
                                        {service.base_price > 0
                                            ? `From $${Number(service.base_price).toFixed(0)}${service.price_unit === 'per_kw' ? '/kW' : ''}`
                                            : 'FREE'}
                                    </span>
                                    <Link
                                        href={route('services.show', service.slug)}
                                        className="text-sm text-solar-400 hover:text-solar-300 font-medium flex items-center gap-1"
                                    >
                                        Book Now <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link href={route('services.index')} className="inline-flex items-center gap-2 border border-solar-500/50 text-solar-400 hover:bg-solar-500/10 font-semibold px-8 py-3 rounded-xl transition-all">
                            View All Services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why SolaraKH */}
            <section id="why-us" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="font-heading font-bold text-3xl text-white mb-3">Why Choose SolaraKH?</h2>
                    <p className="text-slate-400">We're not just selling solar — we're building Cambodia's clean energy future</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {whyUs.map((item, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl bg-dark-800/50 border border-slate-700/30 hover:border-solar-500/30 transition-all">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-solar-500/10 rounded-2xl text-solar-400 mb-4">
                                {item.icon}
                            </div>
                            <h3 className="font-heading font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-dark-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-heading font-bold text-3xl text-white mb-3">What Our Customers Say</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-dark-800 border border-slate-700/50 rounded-2xl p-6">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({length: t.stars}).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-solar-400 text-solar-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                                <div>
                                    <p className="font-semibold text-white text-sm">{t.name}</p>
                                    <p className="text-slate-400 text-xs">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden bg-gradient-to-r from-solar-600 via-solar-500 to-solar-400 rounded-3xl p-12 text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2" />
                    <div className="relative">
                        <h2 className="font-heading font-black text-3xl sm:text-4xl text-dark-900 mb-4">
                            Ready to Go Solar?
                        </h2>
                        <p className="text-dark-800 text-lg mb-8">
                            Get a free site assessment and custom solar proposal — no obligation.
                        </p>
                        <Link
                            href={route('services.show', 'free-solar-consultation')}
                            className="inline-flex items-center gap-2 bg-dark-900 text-solar-400 font-bold px-8 py-4 rounded-xl hover:bg-dark-800 transition-colors shadow-lg"
                        >
                            Get Free Consultation
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
