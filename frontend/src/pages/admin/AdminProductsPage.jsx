import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../api/products';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';
import { formatPrice } from '../../components/ProductCard';

const EMPTY_FORM = { name: '', description: '', price: '', stockQuantity: '' };

export default function AdminProductsPage() {
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {id,...} = edit
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => getProducts({ page, size: 10 }),
    placeholderData: (prev) => prev,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-products'] });

  const saveMutation = useMutation({
    mutationFn: ({ id, product }) => (id ? updateProduct(id, product) : createProduct(product)),
    onSuccess: () => {
      toast.success('Product saved');
      setEditing(null);
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Save failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted');
      invalidate();
    },
    onError: (err) => toast.error(err?.response?.data?.message ?? 'Delete failed'),
  });

  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  if (isPending) return <Spinner />;
  if (isError) return <p className="py-12 text-center text-rose-600">Could not load products.</p>;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Manage products</h1>
        <button
          type="button"
          onClick={() => setEditing({})}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          New product
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((product) => (
              <tr key={product.id} className="border-b border-slate-100">
                <td className="p-4 font-medium text-slate-900">{product.name}</td>
                <td className="p-4 text-slate-600">{formatPrice(product.price)}</td>
                <td className="p-4 text-slate-600">{product.stockQuantity}</td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    onClick={() => setEditing(product)}
                    className="mr-3 font-medium text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="font-medium text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />

      {editing !== null && (
        <ProductFormModal
          product={editing}
          saving={saveMutation.isPending}
          onSave={(product) => saveMutation.mutate({ id: editing.id, product })}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}

function ProductFormModal({ product, saving, onSave, onClose }) {
  const [form, setForm] = useState(
    product.id
      ? {
          name: product.name,
          description: product.description ?? '',
          price: String(product.price),
          stockQuantity: String(product.stockQuantity),
        }
      : EMPTY_FORM
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 id="product-form-title" className="text-lg font-bold text-slate-900">
          {product.id ? 'Edit product' : 'New product'}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              value={form.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                Price ($)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-slate-700">
                Stock
              </label>
              <input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                required
                value={form.stockQuantity}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
