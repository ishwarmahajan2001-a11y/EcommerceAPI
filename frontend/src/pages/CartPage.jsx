import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { placeOrder } from '../api/orders';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../components/ProductCard';

export default function CartPage() {
  const { items, totalAmount, setQuantity, removeItem, clear, toOrderItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const checkout = useMutation({
    mutationFn: () => placeOrder(toOrderItems()),
    onSuccess: (order) => {
      clear();
      toast.success(`Order #${order.id} placed!`);
      navigate(`/orders/${order.id}`);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message ?? 'Could not place the order.'),
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast('Please sign in to checkout.');
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    checkout.mutate();
  };

  if (items.length === 0) {
    return (
      <div data-testid="cart-page" className="py-12 text-center">
        <p className="text-slate-500">Your cart is empty.</p>
        <Link to="/" className="mt-2 inline-block text-indigo-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <section data-testid="cart-page" className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Your cart</h1>
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-50 text-xl font-bold text-indigo-300">
              {product.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <Link
                to={`/products/${product.id}`}
                className="font-medium text-slate-900 hover:text-indigo-600"
              >
                {product.name}
              </Link>
              <p className="text-sm text-slate-500">{formatPrice(product.price)} each</p>
            </div>
            <label className="sr-only" htmlFor={`qty-${product.id}`}>
              Quantity for {product.name}
            </label>
            <input
              id={`qty-${product.id}`}
              type="number"
              min={1}
              max={product.stockQuantity}
              value={quantity}
              onChange={(e) => setQuantity(product.id, Number(e.target.value))}
              className="w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
            />
            <span className="w-24 text-right font-semibold text-slate-900">
              {formatPrice(product.price * quantity)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(product.id)}
              aria-label={`Remove ${product.name}`}
              className="text-sm font-medium text-rose-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <span className="text-lg font-semibold text-slate-900">
          Total: {formatPrice(totalAmount)}
        </span>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={checkout.isPending}
          className="rounded-md bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {checkout.isPending ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </section>
  );
}
