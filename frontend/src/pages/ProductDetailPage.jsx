import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../components/ProductCard';
import Spinner from '../components/Spinner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { data: product, isPending, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });

  if (isPending) return <Spinner />;
  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-rose-600">Product not found.</p>
        <Link to="/" className="mt-2 inline-block text-indigo-600 hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const outOfStock = product.stockQuantity <= 0;
  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to products
      </Link>
      <div className="my-6 flex h-48 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-slate-100 text-7xl font-bold text-indigo-300">
        {product.name.charAt(0).toUpperCase()}
      </div>
      <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
      {product.description && <p className="mt-3 text-slate-600">{product.description}</p>}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-3xl font-bold text-slate-900">{formatPrice(product.price)}</span>
        <span
          className={`text-sm font-medium ${outOfStock ? 'text-rose-600' : 'text-emerald-600'}`}
        >
          {outOfStock ? 'Out of stock' : `${product.stockQuantity} in stock`}
        </span>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
        className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Add to cart
      </button>
    </article>
  );
}
