import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Sun } from 'lucide-react';
import { toast } from 'react-hot-toast';

function CartRow({ item }) {
    const update = (qty) => {
        router.patch(route('cart.update', item.id), { quantity: qty }, { preserveScroll: true });
    };

    const remove = () => {
        router.delete(route('cart.remove', item.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Item removed from cart.'),
        });
    };

    return (
        <div className="flex items-center gap-4 py-5 border-b border-slate-700/50 last:border-0">
            {/* Image */}
            <div className="w-20 h-20 bg-dark-900 rounded-xl flex-shrink-0 overflow-hidden">
                {item.image ? (
                    <img src={`/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-solar-500/20">
                        <Sun className="w-8 h-8" />
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm line-clamp-1">{item.name}</h3>
                {item.sku && <p className="text-xs text-slate-400 mt-0.5">SKU: {item.sku}</p>}
                <p className="text-solar-400 font-semibold mt-1">${Number(item.price).toFixed(2)}</p>
            </div>

            {/* Qty stepper */}
            <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden">
                <button
                    onClick={() => update(Math.max(1, item.quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white hover:bg-dark-700"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-white font-semibold">{item.quantity}</span>
                <button
                    onClick={() => update(Math.min(item.stock_qty, item.quantity + 1))}
                    className="p-2 text-slate-400 hover:text-white hover:bg-dark-700"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Subtotal */}
            <div className="text-right min-w-[80px]">
                <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            {/* Remove */}
            <button onClick={remove} className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

export default function Cart({ cartItems, cartTotal }) {
    const shipping = cartTotal >= 500 ? 0 : (cartTotal > 0 ? 10 : 0);
    const total = cartTotal + shipping;

    if (!cartItems || cartItems.length === 0) {
        return (
            <MainLayout>
                <Head title="Shopping Cart — SolaraKH" />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="w-24 h-24 bg-solar-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-12 h-12 text-solar-400/50" />
                    </div>
                    <h2 className="font-heading font-bold text-2xl text-white mb-3">Your cart is empty</h2>
                    <p className="text-slate-400 mb-8">Discover our premium solar products and start powering your future.</p>
                    <Link href={route('shop.index')} className="bg-solar-500 hover:bg-solar-400 text-dark-900 font-bold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        Start Shopping
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Shopping Cart — SolaraKH" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="font-heading font-bold text-2xl text-white mb-8">
                    Shopping Cart <span className="text-slate-400 font-normal text-lg">({cartItems.length} items)</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart items */}
                    <div className="lg:col-span-2">
                        <div className="bg-dark-800 border border-slate-700/50 rounded-2xl p-6">
                            {cartItems.map(item => (
                                <CartRow key={item.id} item={item} />
                            ))}
                        </div>

                        <Link href={route('shop.index')} className="inline-flex items-center gap-2 text-solar-400 hover:text-solar-300 mt-4 text-sm">
                            ← Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-dark-800 border border-slate-700/50 rounded-2xl p-6 sticky top-24">
                            <h2 className="font-heading font-bold text-white text-lg mb-5">Order Summary</h2>

                            <div className="space-y-3 mb-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="text-white">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Shipping</span>
                                    <span className={shipping === 0 ? 'text-emerald-400 font-semibold' : 'text-white'}>
                                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {cartTotal < 500 && cartTotal > 0 && (
                                    <p className="text-xs text-slate-500">
                                        Add ${(500 - cartTotal).toFixed(2)} more for free shipping
                                    </p>
                                )}
                                <div className="border-t border-slate-700 pt-3 flex justify-between">
                                    <span className="font-bold text-white">Total</span>
                                    <span className="font-bold text-xl text-solar-400">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="flex gap-2 mb-5">
                                <input
                                    type="text"
                                    placeholder="Coupon code"
                                    className="flex-1 bg-dark-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm focus:border-solar-500 focus:outline-none"
                                />
                                <button className="bg-dark-700 hover:bg-dark-600 text-slate-300 text-sm px-4 py-2 rounded-xl transition-colors">
                                    Apply
                                </button>
                            </div>

                            <Link
                                href={route('checkout.index')}
                                className="w-full flex items-center justify-center gap-2 bg-solar-500 hover:bg-solar-400 text-dark-900 font-bold py-3.5 rounded-xl transition-colors"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
