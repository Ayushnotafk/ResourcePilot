import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { assignmentApi, assetApi } from '../services';
import { useAuth } from '../context/AuthContext';

export default function RequestsPage() {
  const { hasPermission, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ purpose: '', assetId: '', neededFrom: '', submit: true });

  const load = () => {
    assignmentApi.listRequests().then(({ data }) => setRequests(data.data));
  };

  useEffect(() => {
    load();
    assetApi.list({ status: 'in_stock' }).then(({ data }) => setAssets(data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignmentApi.createRequest({
        ...form,
        assetId: form.assetId ? Number(form.assetId) : undefined,
        submit: true,
      });
      setShowForm(false);
      setForm({ purpose: '', assetId: '', neededFrom: '', submit: true });
      load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to submit request');
    }
  };

  const handleApprove = async (req) => {
    const assetId = req.assetId || assets[0]?.id;
    if (!assetId) return alert('No available asset to assign');
    try {
      await assignmentApi.approveRequest(req.id, { assetId });
      load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Approval failed');
    }
  };

  const handleReject = async (req) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    try {
      await assignmentApi.rejectRequest(req.id, reason);
      load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Rejection failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignment Requests</h1>
          <p className="text-slate-500">Workflow-based asset allocation</p>
        </div>
        {hasPermission('assignment.request') && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white"
          >
            + New Request
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <textarea
            placeholder="Purpose of request"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
            rows={3}
            required
          />
          <select
            value={form.assetId}
            onChange={(e) => setForm({ ...form, assetId: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">Select asset (optional)</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.assetTag} — {a.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={form.neededFrom}
            onChange={(e) => setForm({ ...form, neededFrom: e.target.value })}
            className="rounded-lg border px-3 py-2"
            required
          />
          <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm text-white">
            Submit Request
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Request #</th>
              <th className="px-4 py-3 text-left">Requester</th>
              <th className="px-4 py-3 text-left">Purpose</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="px-4 py-3 font-medium">{req.requestNumber}</td>
                <td className="px-4 py-3">{req.requester?.firstName} {req.requester?.lastName}</td>
                <td className="px-4 py-3 max-w-xs truncate">{req.purpose}</td>
                <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                <td className="px-4 py-3">
                  {req.status === 'submitted' && hasPermission('assignment.approve') && (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleApprove(req)} className="text-emerald-600 text-xs font-medium">Approve</button>
                      <button type="button" onClick={() => handleReject(req)} className="text-red-600 text-xs font-medium">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
