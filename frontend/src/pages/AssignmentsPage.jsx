import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { assignmentApi } from '../services';
import { useAuth } from '../context/AuthContext';

export default function AssignmentsPage() {
  const { hasPermission } = useAuth();
  const [assignments, setAssignments] = useState([]);

  const load = () => {
    const fn = hasPermission('assignment.read') ? assignmentApi.list : assignmentApi.my;
    fn({ status: 'active' }).then(({ data }) => setAssignments(data.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleReturn = async (id) => {
    const condition = prompt('Return condition (excellent/good/fair/poor/damaged):', 'good');
    if (!condition) return;
    try {
      await assignmentApi.returnAssignment(id, {
        returnCondition: condition,
        returnNotes: 'Returned via AssetFlow',
      });
      load();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Return failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-slate-500">Active asset custody records</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Assignment #</th>
              <th className="px-4 py-3 text-left">Asset</th>
              <th className="px-4 py-3 text-left">Custodian</th>
              <th className="px-4 py-3 text-left">Assigned</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No active assignments
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-medium">{a.assignmentNumber}</td>
                  <td className="px-4 py-3">{a.asset?.assetTag} — {a.asset?.name}</td>
                  <td className="px-4 py-3">{a.custodian?.firstName} {a.custodian?.lastName}</td>
                  <td className="px-4 py-3">{new Date(a.assignedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    {a.status === 'active' && hasPermission('assignment.return') && (
                      <button
                        type="button"
                        onClick={() => handleReturn(a.id)}
                        className="text-brand-600 text-xs font-medium"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
