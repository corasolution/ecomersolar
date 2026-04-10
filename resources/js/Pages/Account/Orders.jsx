import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShoppingBag, ChevronRight, Package } from 'lucide-react';
import clsx from 'clsx';

const statusColors = {
    new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    processing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const paymentColors = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AccountOrders({ orders }) {
    if (!orders.data || orders.data.length === 0) {
        return (
            <MainLayout>
                <Head title="My Orders — SolaraKH" />
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="w-20 h-20 bg-solar-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-solar-400/50" />
                    </div>
                    <h2 className="font-heading font-bold text-2xl text-white mb-3">No orders yet</h2>
                    <p className="text-slate-400 mb-8">Your order history will appear here once you've made a purchase.</p>
                    <Link href={route('shop.index')} className="bg-solar-500 hover:bg-solar-400 text-dark-900 font-bold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        Start Shopping
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="My Orders — SolaraKH" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="font-heading font-bold text-2xl text-white mb-8">My Orders</h1>

                <div className="space-y-4">
                    {orders.data.map(order => (
                        <div key={order.id} className="bg-dark-800 border border-slate-700/50 rounded-2xl p-5 hover:border-solar-500/30 transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap mb-2">
                                        <span className="font-mono font-bold text-solar-400 text-sm">{order.order_number}</span>
                                        <span className={clsx('text-xs font-semibold px-2.5 py-0.5 rounded-full border', statusColors[order.order_status] || statusColors.new)}>
                                            {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                        </span>
                                        <span className={clsx('text-xs font-semibold px-2.5 py-0.5 rounded-full border', paymentColors[order.payment_status] || paymentColors.pending)}>
                                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm">
                                        {order.created_at} · {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <p className="font-heading font-bold text-white text-lg">${Number(order.total).toFixed(2)}</p>
                                    <Link
                                        href={route('account.orders.show', order.order_number)}
                                        className="inline-flex items-center gap-1 text-solar-400 hover:text-solar-300 text-sm mt-1"
                                    >
                                        View Details <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {orders.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={clsx(
                                    'px-3 py-2 rounded-lg text-sm',
                                    link.active ? 'bg-solar-500 text-dark-900 font-bold' :
                                    link.url ? 'bg-dark-800 text-slate-300 hover:bg-dark-700' :
                                    'bg-dark-900 text-slate-600 pointer-events-none'
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
