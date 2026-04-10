import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/Shop/ProductCard';
import { ShoppingCart, Star, Zap, Shield, Truck, Wrench, ChevronRight, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

const tabs = ['Description', 'Specifications', 'Reviews', 'Warranty'];

export default function ProductDetail({ product, relatedProducts }) {
    const [mainImage, setMainImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Description');

    const addToCart = () => {
        router.post(route('cart.add'), { product_id: product.id, quantity }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${product.name} added to cart!`),
            onError: () => toast.error('Failed to add to cart.'),
        });
    };

    const displayPrice = product.sale_price ?? product.price;
    const hasDiscount = !!product.sale_price;
    const images = product.images?.length > 0 ? product.images : [null];

    return (
        <MainLayout>
            <Head title={`${product.name} — SolaraKH`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
                    <Link href={route('home')} className="hover:text-solar-400">Home</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href={route('shop.index')} className="hover:text-solar-400">Shop</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href={route('shop.index', { categories: [product.category.slug] })} className="hover:text-solar-400">
                        {product.category.name}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white truncate max-w-xs">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <div>
                        <div className="bg-dark-800 rounded-2xl border border-slate-700/50 aspect-square mb-4 overflow-hidden relative group">
                            {images[mainImage] ? (
                                <img
                                    src={`/storage/${images[mainImage]}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-32 h-32 text-solar-500/20">
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                    </div>
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.slice(0, 4).map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setMainImage(i)}
                                        className={clsx(
                                            'aspect-square bg-dark-800 rounded-xl overflow-hidden border-2 transition-all',
                                            mainImage === i ? 'border-solar-500' : 'border-slate-700/50 hover:border-solar-500/50'
                                        )}
                                    >
                                        {img && <img src={`/storage/${img}`} alt="" className="w-full h-full object-cover" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <span className="inline-block bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                            {product.category.name}
                        </span>

                        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-4">{product.name}</h1>

                        {/* Chips */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.brand && (
                                <span className="bg-dark-800 border border-slate-700 text-slate-300 text-sm px-3 py-1 rounded-full">
                                    {product.brand}
                                </span>
                            )}
                            {product.wattage && (
                                <span className="flex items-center gap-1 bg-solar-500/10 border border-solar-500/20 text-solar-400 text-sm px-3 py-1 rounded-full">
                                    <Zap className="w-3.5 h-3.5" /> {product.wattage}
                                </span>
                            )}
                            {product.warranty_years && (
                                <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-3 py-1 rounded-full">
                                    <Shield className="w-3.5 h-3.5" /> {product.warranty_years}yr Warranty
                                </span>
                            )}
                        </div>

                        {/* Rating + Stock */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-solar-400 text-solar-400" />)}
                                <Star className="w-4 h-4 fill-solar-400/50 text-solar-400" />
                                <span className="text-sm text-slate-400 ml-1">4.5 (12 reviews)</span>
                            </div>
                            <span className={clsx(
                                'text-sm font-semibold px-3 py-1 rounded-full',
                                product.stock_qty > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            )}>
                                {product.stock_qty > 0 ? `In Stock (${product.stock_qty})` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end gap-3 mb-6">
                            <span className="font-heading font-black text-3xl text-white">
                                ${Number(displayPrice).toFixed(2)}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-slate-500 line-through mb-0.5">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Quantity + Add to Cart */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-5 text-white font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock_qty, quantity + 1))}
                                    className="p-3 text-slate-400 hover:text-white hover:bg-dark-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={addToCart}
                                disabled={product.stock_qty === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-solar-500 hover:bg-solar-400 disabled:bg-slate-700 text-dark-900 font-bold py-3.5 rounded-xl transition-colors"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>

                        {/* Book Installation button for panels/kits */}
                        <Link
                            href={route('services.show', 'residential-solar-installation')}
                            className="flex items-center justify-center gap-2 w-full border border-solar-500/50 text-solar-400 hover:bg-solar-500/10 font-semibold py-3 rounded-xl transition-all mb-6"
                        >
                            <Wrench className="w-4 h-4" />
                            Book Professional Installation
                        </Link>

                        {/* Highlights */}
                        <div className="space-y-3 bg-dark-800 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <Truck className="w-5 h-5 text-solar-400 flex-shrink-0" />
                                <span>Free delivery on orders over <span className="text-white font-semibold">$500</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <Shield className="w-5 h-5 text-solar-400 flex-shrink-0" />
                                <span>Genuine manufacturer warranty — {product.warranty_years} years</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                <Wrench className="w-5 h-5 text-solar-400 flex-shrink-0" />
                                <span>Expert installation available across Cambodia</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border border-slate-700/50 rounded-2xl overflow-hidden mb-16">
                    <div className="flex border-b border-slate-700/50">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    'flex-1 py-3.5 text-sm font-medium transition-colors',
                                    activeTab === tab
                                        ? 'bg-solar-500/10 text-solar-400 border-b-2 border-solar-500'
                                        : 'text-slate-400 hover:text-white'
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'Description' && (
                            <div
                                className="prose prose-invert prose-sm max-w-none text-slate-300"
                                dangerouslySetInnerHTML={{ __html: product.description || product.short_description }}
                            />
                        )}

                        {activeTab === 'Specifications' && (
                            <div className="overflow-x-auto">
                                {Object.keys(product.specifications || {}).length > 0 ? (
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-slate-700/50">
                                            {Object.entries(product.specifications).map(([key, val]) => (
                                                <tr key={key}>
                                                    <td className="py-3 pr-8 text-slate-400 font-medium w-1/3">{key}</td>
                                                    <td className="py-3 text-white">{val}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-slate-400">No specifications available.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'Reviews' && (
                            <div className="text-center py-8">
                                <div className="flex justify-center gap-1 mb-3">
                                    {[1,2,3,4].map(i => <Star key={i} className="w-6 h-6 fill-solar-400 text-solar-400" />)}
                                    <Star className="w-6 h-6 fill-solar-400/50 text-solar-400" />
                                </div>
                                <p className="font-heading font-bold text-white text-2xl mb-1">4.5 / 5</p>
                                <p className="text-slate-400">Based on 12 customer reviews</p>
                            </div>
                        )}

                        {activeTab === 'Warranty' && (
                            <div className="space-y-3 text-slate-300">
                                <p>✓ <strong className="text-white">{product.warranty_years}-year</strong> manufacturer performance warranty</p>
                                <p>✓ <strong className="text-white">2-year</strong> installation workmanship warranty (if installed by SolaraKH)</p>
                                <p>✓ Warranty claims processed within <strong className="text-white">5 business days</strong></p>
                                <p>✓ On-site inspection and replacement service across Cambodia</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="font-heading font-bold text-2xl text-white mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {relatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
