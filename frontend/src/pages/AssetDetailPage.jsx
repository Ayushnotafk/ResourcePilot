import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { assetApi } from '../services';
import { useAuth } from '../context/AuthContext';

export default function AssetDetailPage() {
  const { id } = useParams();
  const { hasPermission } = useAuth();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    assetApi
      .getById(id)
      .then(({ data }) => setAsset(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleTransition = async (toStatus) => {
    const reason = prompt(`Reason for transition to ${toStatus}:`);
    if (reason === null) return;
    try {
      await assetApi.transition(id, toStatus, reason);
      load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Transition failed');
    }
  };

  if (loading) return <div className="text-slate-500">Loading asset...</div>;
  if (!asset) return <div>Asset not found</div>;

  const transitions = {
    in_stock: ['assigned', 'under_maintenance', 'retired'],
    assigned: ['in_stock', 'under_maintenance', 'lost'],
    under_maintenance: ['in_stock', 'assigned', 'retired'],
    draft: ['in_stock'],
    lost: ['retired'],
    retired: ['disposed'],
  };

  const available = transitions[asset.status] || [];

  return (
    <div className="space-y-6">
      <div>
        <Link to="/assets" className="text-sm text-brand-600 hover:underline">
          ← Back to assets
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold">{asset.name}</h1>
          <StatusBadge status={asset.status} />
        </div>
        <p className="text-slate-500">{asset.assetTag} · {asset.serialNumber}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold">Details</h3>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="text-slate-500">Category</dt><dd className="font-medium">{asset.category?.name}</dd></div>
              <div><dt className="text-slate-500">Condition</dt><dd className="font-medium capitalize">{asset.condition}</dd></div>
              <div><dt className="text-slate-500">Department</dt><dd className="font-medium">{asset.department?.name || '—'}</dd></div>
              <div><dt className="text-slate-500">Location</dt><dd className="font-medium">{asset.location?.name || '—'}</dd></div>
              <div><dt className="text-slate-500">Purchase Cost</dt><dd className="font-medium">₹{Number(asset.purchaseCost || 0).toLocaleString('en-IN')}</dd></div>
              <div><dt className="text-slate-500">Assigned To</dt><dd className="font-medium">{asset.assignedTo ? `${asset.assignedTo.firstName} ${asset.assignedTo.lastName}` : '—'}</dd></div>
            </dl>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold">Status History</h3>
            <div className="space-y-3">
              {(asset.statusHistory || []).map((h) => (
                <div key={h.id} className="flex items-start gap-3 border-l-2 border-brand-200 pl-4">
                  <div>
                    <p className="text-sm font-medium">
                      {h.fromStatus || 'created'} → {h.toStatus}
                    </p>
                    <p className="text-xs text-slate-500">
                      {h.changer?.firstName} {h.changer?.lastName} · {new Date(h.createdAt).toLocaleString()}
                    </p>
                    {h.reason && <p className="mt-1 text-sm text-slate-600">{h.reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {hasPermission('asset.transition') && available.length > 0 && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-semibold">Actions</h3>
              <div className="space-y-2">
                {available.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleTransition(s)}
                    className="w-full rounded-lg border px-3 py-2 text-left text-sm capitalize hover:bg-slate-50"
                  >
                    Move to {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
