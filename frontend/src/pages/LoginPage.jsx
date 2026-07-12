import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@assetflow.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-sidebar lg:flex lg:flex-col lg:justify-center lg:px-16">
        <h1 className="text-4xl font-bold text-white">AssetFlow</h1>
        <p className="mt-4 max-w-md text-lg text-slate-300">
          Enterprise asset and resource management — track laptops, equipment, and meeting rooms
          across your organization.
        </p>
        <ul className="mt-8 space-y-2 text-sm text-slate-400">
          <li>• Lifecycle state management</li>
          <li>• Approval workflows</li>
          <li>• Role-based access control</li>
          <li>• Audit trails & reporting</li>
        </ul>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">Access your AssetFlow workspace</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-600">
            <p className="font-medium">Demo accounts (password: Admin@123)</p>
            <p>admin@assetflow.com — Super Admin</p>
            <p>manager@assetflow.com — Asset Manager</p>
            <p>employee@assetflow.com — Employee</p>
          </div>
        </form>
      </div>
    </div>
  );
}
