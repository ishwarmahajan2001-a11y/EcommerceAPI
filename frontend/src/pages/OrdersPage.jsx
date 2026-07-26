import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../api/orders';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import { formatPrice } from '../components/ProductCard';

export default function OrdersPage() {
  const { data: orders, isPending, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: getMyOrders,
  });

  if (isPending) return <Spinner />;
  if (isError) return <p className="py-12 text-center text-rose-600">Could not load orders.</p>;

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">No orders yet.</p>
        <Link to="/" className="mt-2 inline-block text-indigo-600 hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">My orders</h1>
      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              to={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <span className="font-semibold text-slate-900">#{order.id}</span>
                <p className="text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleString()} · {order.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900">
                  {formatPrice(order.totalAmount)}
                </span>
                <StatusBadge status={order.status} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
