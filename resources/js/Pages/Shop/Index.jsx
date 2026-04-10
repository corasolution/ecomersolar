import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/Shop/ProductCard';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, LayoutGrid, List, Search } from 'lucide-react';
import clsx from 'clsx';

function SidebarFilters({ categories, brands, wattages, filters, onFilter, onClear }) {
    const [localFilters, setLocalFilters] = useState({
        categories: filters.categories ? [].concat(filters.categories) : [],
        brands: filters.brands ? [].concat(filters.brands) : [],
        wattages: filters.wattages ? [].concat(filters.wattages) : [],
        min_price: filters.min_price || '',
        max_price: filters.max_price || '',
    });

    const toggle = (key, val) => {
        const arr = localFilters[key];
        const next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
        const updated = { ...localFilters, [key]: next };
        setLocalFilters(updated);
        onFilter(updated);
    };

    const updatePrice = (key, val) => {
        const updated = { ...localFilters, [key]: val };
        setLocalFilters(updated);
    };

    const applyPrice = () => onFilter(localFilters);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-white">Filters</h3>
                <button onClick={onClear} className="text-xs text-solar-400 hover:text-solar-300">Clear All</button>
            </div>

            {/* Categories */}
            <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Category</h4>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={localFilters.categories.includes(cat.slug)}
                                onChange={() => toggle('categories', cat.slug)}
                                className="rounded border-slate-600 bg-dark-900 text-solar-500 focus:ring-solar-500"
                            />
                            <span className="text-sm text-slate-400 group-hover:text-white">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Price Range (USD)</h4>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        value={localFilters.min_price}
                        onChange={e => updatePrice('min_price', e.target.value)}
                        onBlur={applyPrice}
                        className="w-full bg-dark-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-sm focus:border-solar-500 focus:outline-none"
                    />
                    <span className="text-slate-500">–</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={localFilters.max_price}
                        onChange={e => updatePrice('max_price', e.target.value)}
                        onBlur={applyPrice}
                        className="w-full bg-dark-900 border border-slate-700 text-white rounded-lg px-2 py-1.5 text-sm focus:border-solar-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Brand</h4>
                    <div className="space-y-2">
                        {brands.map(brand => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={localFilters.brands.includes(brand)}
                                    onChange={() => toggle('brands', brand)}
                                    className="rounded border-slate-600 bg-dark-900 text-solar-500 focus:ring-solar-500"
                                />
                                <span className="text-sm text-slate-400 group-hover:text-white">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Wattage */}
            {wattages.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Wattage</h4>
                    <div className="space-y-2">
                        {wattages.map(w => (
                            <label key={w} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={localFilters.wattages.includes(w)}
                                    onChange={() => toggle('wattages', w)}
                                    className="rounded border-slate-600 bg-dark-900 text-solar-500 focus:ring-solar-500"
                                />
                                <span className="text-sm text-slate-400 group-hover:text-white">{w}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ShopIndex({ products, categories, brands, wattages, filters }) {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    const applyFilters = (newFilters) => {
        const cleaned = {};
        Object.entries(newFilters).forEach(([k, v]) => {
            if (Array.isArray(v) ? v.length > 0 : v !== '') cleaned[k] = v;
        });
        router.get(route('shop.index'), cleaned, { preserveScroll: true, preserveState: true });
    };

    const clearFilters = () => router.get(route('shop.index'));

    const hasFilters = Object.keys(filters).length > 0;

    return (
        <MainLayout>
            <Head title="Shop Solar Products — SolaraKH" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="font-heading font-bold text-2xl text-white">Solar Products</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {products.total} product{products.total !== 1 ? 's' : ''} found
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24 bg-dark-800 border border-slate-700/50 rounded-2xl p-5">
                            <SidebarFilters
                                categories={categories}
                                brands={brands}
                                wattages={wattages}
                                filters={filters}
                                onFilter={applyFilters}
                                onClear={clearFilters}
                            />
                        </div>
                    </aside>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 gap-3">
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-2 bg-dark-800 border border-slate-700 text-slate-300 text-sm px-4 py-2 rounded-xl"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters {hasFilters && <span className="bg-solar-500 text-dark-900 text-xs font-bold px-1.5 rounded-full">!</span>}
                            </button>

                            <div className="flex items-center gap-3 ml-auto">
                                <select
                                    value={filters.sort || 'featured'}
                                    onChange={e => applyFilters({ ...filters, sort: e.target.value })}
                                    className="bg-dark-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 focus:border-solar-500 focus:outline-none"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="newest">Newest</option>
                                </select>

                                <div className="flex border border-slate-700 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={clsx('p-2', viewMode === 'grid' ? 'bg-solar-500 text-dark-900' : 'bg-dark-800 text-slate-400')}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={clsx('p-2', viewMode === 'list' ? 'bg-solar-500 text-dark-900' : 'bg-dark-800 text-slate-400')}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Products grid */}
                        {products.data.length > 0 ? (
                            <>
                                <div className={clsx(
                                    'grid gap-5',
                                    viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                                )}>
                                    {products.data.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        {products.links.map((link, i) => (
                                            <button
                                                key={i}
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                className={clsx(
                                                    'px-3 py-2 rounded-lg text-sm transition-colors',
                                                    link.active ? 'bg-solar-500 text-dark-900 font-bold' :
                                                    link.url ? 'bg-dark-800 text-slate-300 hover:bg-dark-700' :
                                                    'bg-dark-900 text-slate-600 cursor-not-allowed'
                                                )}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-solar-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-solar-400/50" />
                                </div>
                                <h3 className="font-heading font-bold text-white text-lg mb-2">No products found</h3>
                                <p className="text-slate-400 mb-6">Try adjusting your filters or search criteria</p>
                                <button onClick={clearFilters} className="bg-solar-500 text-dark-900 font-semibold px-6 py-2.5 rounded-xl hover:bg-solar-400 transition-colors">
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="relative ml-auto w-80 bg-dark-800 h-full overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-heading font-bold text-white text-lg">Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <SidebarFilters
                            categories={categories}
                            brands={brands}
                            wattages={wattages}
                            filters={filters}
                            onFilter={(f) => { applyFilters(f); setMobileFiltersOpen(false); }}
                            onClear={() => { clearFilters(); setMobileFiltersOpen(false); }}
                        />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
