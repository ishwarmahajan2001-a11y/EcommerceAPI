import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export const formatPrice = (value) => `$${Number(value).toFixed(2)}`;

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stockQuantity <= 0;

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-slate-100 text-4xl font-bold text-indigo-300">
        {product.name.charAt(0).toUpperCase()}
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        <Link to={`/products/${product.id}`} className="hover:text-indigo-600">
          {product.name}
        </Link>
      </h3>
      {product.description && (
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">{product.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
        <span className={`text-xs font-medium ${outOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
          {outOfStock ? 'Out of stock' : `${product.stockQuantity} in stock`}
        </span>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Add to cart
      </button>
    </article>
  );
}
