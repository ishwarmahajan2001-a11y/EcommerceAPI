import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getMyOrders, updateOrderStatus } from '../../api/orders';
import StatusBadge from '../../components/StatusBadge';
import Spinner from '../../components/Spinner';
import { formatPrice } from '../../components/ProductCard';

const STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders, isPending, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getMyOrders,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (updated) => {
      toast.success(`Order #${updated.id} → ${updated.status}`);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Status update failed'),
  });

  if (isPending) return <Spinner />;
  if (isError) return <p className="py-12 text-center text-rose-600">Could not load orders.</p>;

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Manage orders</h1>
      {orders.length === 0 ? (
        <p className="py-12 text-center text-slate-500">No orders to manage.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Placed</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Change status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">#{order.id}</td>
                  <td className="p-4 text-slate-600">{order.username}</td>
                  <td className="p-4 text-slate-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 text-slate-600">{formatPrice(order.totalAmount)}</td>
                  <td className="p-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-4">
                    <label className="sr-only" htmlFor={`status-${order.id}`}>
                      Status for order {order.id}
                    </label>
                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      disabled={statusMutation.isPending}
                      onChange={(e) =>
                        statusMutation.mutate({ id: order.id, status: e.target.value })
                      }
                      className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
