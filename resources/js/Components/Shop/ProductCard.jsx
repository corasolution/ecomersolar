import { Link, router } from '@inertiajs/react';
import { ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

export default function ProductCard({ product, className }) {
    const addToCart = (e) => {
        e.preventDefault();
        router.post(route('cart.add'), { product_id: product.id, quantity: 1 }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${product.name} added to cart!`),
            onError: () => toast.error('Failed to add to cart.'),
        });
    };

    const displayPrice = product.sale_price ?? product.price;
    const hasDiscount = !!product.sale_price;

    return (
        <Link
            href={route('shop.show', product.slug)}
            className={clsx(
                'group bg-dark-800 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-solar-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-solar-500/10 block',
                className
            )}
        >
            {/* Image */}
            <div className="relative bg-dark-900 aspect-square overflow-hidden">
                {product.first_image ? (
                    <img
                        src={`/storage/${product.first_image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 text-solar-500/30">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                    </div>
                )}
                {/* Category badge */}
                {product.category && (
                    <span className="absolute top-3 left-3 bg-dark-900/80 backdrop-blur-sm text-solar-400 text-xs font-medium px-2.5 py-1 rounded-full border border-solar-500/30">
                        {product.category.name}
                    </span>
                )}
                {hasDiscount && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        SALE
                    </span>
                )}
                {/* Stock badge */}
                {product.stock_qty === 0 && (
                    <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
                        <span className="bg-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-medium">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Brand + Wattage */}
                <div className="flex items-center gap-2 mb-2">
                    {product.brand && (
                        <span className="text-xs text-slate-400 font-medium">{product.brand}</span>
                    )}
                    {product.wattage && (
                        <span className="flex items-center gap-0.5 bg-solar-500/10 text-solar-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-solar-500/20">
                            <Zap className="w-3 h-3" />
                            {product.wattage}
                        </span>
                    )}
                </div>

                <h3 className="font-heading font-semibold text-white text-sm leading-snug line-clamp-2 mb-2 group-hover:text-solar-400 transition-colors">
                    {product.name}
                </h3>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4].map(i => (
                        <Star key={i} className="w-3.5 h-3.5 fill-solar-400 text-solar-400" />
                    ))}
                    <Star className="w-3.5 h-3.5 fill-solar-400/50 text-solar-400" />
                    <span className="text-xs text-slate-400 ml-1">4.5</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold text-white">
                            ${Number(displayPrice).toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-slate-500 line-through ml-2">
                                ${Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={addToCart}
                        disabled={product.stock_qty === 0}
                        className="p-2 bg-solar-500 hover:bg-solar-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-dark-900 rounded-xl transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Link>
    );
}
