import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAdminAuth, getAdminAuthHeaders, getAdminToken, setAdminToken } from '../../utils/adminAuth';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      const token = getAdminToken();
      if (!token) {
        setCheckingSession(false);
        return;
      }

      try {
        const response = await fetch(`${API}/api/admin/session`, {
          headers: getAdminAuthHeaders()
        });
        if (response.ok) {
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } catch {
        // If session validation fails, force fresh login.
      }

      clearAdminAuth();
      setCheckingSession(false);
    };

    validateSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      if (data.success) {
        setAdminToken(data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    }
  };

  if (checkingSession) {
    return <div className="admin-panel min-h-screen flex items-center justify-center p-4">Checking admin session...</div>;
  }

  return (
    <div className="admin-panel min-h-screen flex items-center justify-center p-4">
      <div className="admin-card max-w-md w-full rounded-2xl shadow-lg p-8 border border-border">
        <h2 className="text-2xl font-bold text-center mb-6 font-heading">Admin Login</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
