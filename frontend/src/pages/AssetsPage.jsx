import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { assetApi } from '../services';
import { useAuth } from '../context/AuthContext';

export default function AssetsPage() {
  const { hasPermission } = useAuth();
  const [assets, setAssets] = useState([]);
  const [meta, setMeta] = useState({});
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ assetTag: '', name: '', categoryId: 3, serialNumber: '' });

  const loadAssets = () => {
    setLoading(true);
    assetApi
      .list({ search, status, limit: 50 })
      .then(({ data }) => {
        setAssets(data.data);
        setMeta(data.meta);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAssets();
  }, [search, status]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await assetApi.create({ ...form, categoryId: Number(form.categoryId), status: 'in_stock' });
      setShowForm(false);
      setForm({ assetTag: '', name: '', categoryId: 3, serialNumber: '' });
      loadAssets();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to create asset');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assets</h1>
          <p className="text-slate-500">{meta.total || 0} assets in registry</p>
        </div>
        {hasPermission('asset.create') && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            + New Asset
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold">Create Asset</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Asset Tag (e.g. AST-2026-003)"
              value={form.assetTag}
              onChange={(e) => setForm({ ...form, assetTag: e.target.value })}
              className="rounded-lg border px-3 py-2"
              required
            />
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border px-3 py-2"
              required
            />
            <input
              placeholder="Serial Number"
              value={form.serialNumber}
              onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
              className="rounded-lg border px-3 py-2"
              required
            />
            <input
              placeholder="Category ID (3=Laptop)"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="rounded-lg border px-3 py-2"
              required
            />
          </div>
          <button type="submit" className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm text-white">
            Save Asset
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="assigned">Assigned</option>
          <option value="under_maintenance">Under Maintenance</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Tag</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Assigned To</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : assets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/assets/${asset.id}`} className="font-medium text-brand-600 hover:underline">
                      {asset.assetTag}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{asset.name}</td>
                  <td className="px-4 py-3">{asset.category?.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-4 py-3">
                    {asset.assignedTo
                      ? `${asset.assignedTo.firstName} ${asset.assignedTo.lastName}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3">{asset.location?.name || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
