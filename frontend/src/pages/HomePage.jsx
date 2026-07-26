import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';

const PAGE_SIZE = 12;

export default function HomePage() {
  const [page, setPage] = useState(0);
  const { data, isPending, isError } = useQuery({
    queryKey: ['products', page],
    queryFn: () => getProducts({ page, size: PAGE_SIZE }),
    placeholderData: (prev) => prev,
  });

  if (isPending) return <Spinner />;
  if (isError) {
    return (
      <p className="py-12 text-center text-rose-600">
        Could not load products. Is the backend running?
      </p>
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Products</h1>
      {data.content.length === 0 ? (
        <p className="py-12 text-center text-slate-500">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.content.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
    </section>
  );
}
