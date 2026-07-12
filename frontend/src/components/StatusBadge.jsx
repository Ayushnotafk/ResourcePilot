const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-700',
  in_stock: 'bg-emerald-100 text-emerald-800',
  assigned: 'bg-blue-100 text-blue-800',
  under_maintenance: 'bg-amber-100 text-amber-800',
  lost: 'bg-red-100 text-red-800',
  retired: 'bg-gray-100 text-gray-700',
  disposed: 'bg-stone-200 text-stone-800',
  submitted: 'bg-indigo-100 text-indigo-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  active: 'bg-blue-100 text-blue-800',
  returned: 'bg-emerald-100 text-emerald-800',
  overdue: 'bg-orange-100 text-orange-800',
  cancelled: 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ status }) {
  const label = status?.replace(/_/g, ' ') || 'unknown';
  const colors = STATUS_COLORS[status] || 'bg-slate-100 text-slate-700';

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors}`}>
      {label}
    </span>
  );
}
