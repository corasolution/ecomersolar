import { Link, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { ShoppingCart, Sun, Menu, X, User, ChevronDown } from 'lucide-react';

function Navbar() {
    const { auth, cartCount, flash } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.warning) toast(flash.warning, { icon: '⚠️' });
    }, [flash]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={route('home')} className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-solar-500 rounded-lg flex items-center justify-center group-hover:bg-solar-400 transition-colors">
                            <Sun className="w-5 h-5 text-dark-900" />
                        </div>
                        <span className="font-heading font-bold text-xl text-white">
                            Solara<span className="text-solar-400">KH</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href={route('shop.index')} className="text-slate-300 hover:text-solar-400 transition-colors text-sm font-medium">
                            Shop
                        </Link>
                        <Link href={route('services.index')} className="text-slate-300 hover:text-solar-400 transition-colors text-sm font-medium">
                            Services
                        </Link>
                        <a href="#why-us" className="text-slate-300 hover:text-solar-400 transition-colors text-sm font-medium">
                            About
                        </a>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Link href={route('cart.index')} className="relative p-2 text-slate-300 hover:text-solar-400 transition-colors">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-solar-500 text-dark-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {auth.user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:block">{auth.user.name.split(' ')[0]}</span>
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <Link href={route('account.orders')} className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-dark-700">
                                        My Orders
                                    </Link>
                                    <Link href={route('profile.edit')} className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-dark-700">
                                        Profile
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700">
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href={route('login')} className="text-sm text-slate-300 hover:text-white px-3 py-1.5">
                                    Login
                                </Link>
                                <Link href={route('register')} className="text-sm bg-solar-500 hover:bg-solar-400 text-dark-900 font-semibold px-4 py-1.5 rounded-lg transition-colors">
                                    Register
                                </Link>
                            </div>
                        )}

                        <button
                            className="md:hidden p-2 text-slate-300"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-dark-900 border-t border-slate-800 py-4 space-y-1">
                        <Link href={route('shop.index')} className="block px-4 py-2 text-slate-300 hover:text-solar-400">Shop</Link>
                        <Link href={route('services.index')} className="block px-4 py-2 text-slate-300 hover:text-solar-400">Services</Link>
                        {auth.user && (
                            <Link href={route('account.orders')} className="block px-4 py-2 text-slate-300 hover:text-solar-400">My Orders</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

function Footer() {
    return (
        <footer className="bg-dark-900 border-t border-slate-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-solar-500 rounded-lg flex items-center justify-center">
                                <Sun className="w-5 h-5 text-dark-900" />
                            </div>
                            <span className="font-heading font-bold text-xl text-white">
                                Solara<span className="text-solar-400">KH</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xs">
                            Cambodia's trusted solar energy provider. Powering homes and businesses with clean, reliable solar solutions since 2018.
                        </p>
                        <div className="mt-4 space-y-1 text-sm text-slate-400">
                            <p>📍 #45 Norodom Blvd, Phnom Penh, Cambodia</p>
                            <p>📞 +855 12 345 678</p>
                            <p>✉️ info@solarakh.com</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href={route('shop.index')} className="hover:text-solar-400 transition-colors">Solar Panels</Link></li>
                            <li><Link href={route('shop.index')} className="hover:text-solar-400 transition-colors">Inverters</Link></li>
                            <li><Link href={route('shop.index')} className="hover:text-solar-400 transition-colors">Batteries</Link></li>
                            <li><Link href={route('shop.index')} className="hover:text-solar-400 transition-colors">Solar Kits</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold text-white mb-4">Services</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href={route('services.index')} className="hover:text-solar-400 transition-colors">Installation</Link></li>
                            <li><Link href={route('services.index')} className="hover:text-solar-400 transition-colors">Maintenance</Link></li>
                            <li><Link href={route('services.index')} className="hover:text-solar-400 transition-colors">Consultation</Link></li>
                            <li><Link href={route('account.orders')} className="hover:text-solar-400 transition-colors">My Orders</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} SolaraKH Co., Ltd. All rights reserved. | Cambodia Solar Energy Solutions</p>
                </div>
            </div>
        </footer>
    );
}

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-dark-950 text-white">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
                    success: { iconTheme: { primary: '#f59e0b', secondary: '#1e293b' } },
                }}
            />
            <Navbar />
            <main className="pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
}
