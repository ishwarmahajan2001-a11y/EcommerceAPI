const STYLES = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-violet-100 text-violet-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-rose-100 text-rose-800',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? 'bg-slate-100 text-slate-800';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}
