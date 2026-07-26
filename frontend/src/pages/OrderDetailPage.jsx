import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../api/orders';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';
import { formatPrice } from '../components/ProductCard';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isPending, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
  });

  if (isPending) return <Spinner />;
  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-rose-600">Order not found.</p>
        <Link to="/orders" className="mt-2 inline-block text-indigo-600 hover:underline">
          Back to my orders
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Link to="/orders" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to my orders
      </Link>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Placed {new Date(order.createdAt).toLocaleString()}
        </p>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-2 font-medium">Product</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Unit price</th>
              <th className="pb-2 text-right font-medium">Line total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-900">{item.productName}</td>
                <td className="py-3 text-right text-slate-600">{item.quantity}</td>
                <td className="py-3 text-right text-slate-600">{formatPrice(item.unitPrice)}</td>
                <td className="py-3 text-right font-medium text-slate-900">
                  {formatPrice(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-3 text-right font-semibold text-slate-900">
                Total
              </td>
              <td className="pt-3 text-right text-lg font-bold text-slate-900">
                {formatPrice(order.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
