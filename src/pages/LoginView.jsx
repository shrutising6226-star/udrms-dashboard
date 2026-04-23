import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Network } from 'lucide-react';

const LoginView = () => {
  const [email, setEmail] = useState('admin@udrms.gov');
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/registry');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-6">
          <Network size={32} className="text-blue-600" />
          <h2 className="text-center text-3xl font-extrabold text-blue-900 tracking-tight">
            UDRMS
          </h2>
        </div>
        <h2 className="text-center text-xl font-medium text-text-secondary">
          Central Coordination Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:rounded-xl sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-text-primary">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-lg shadow-sm placeholder-text-muted focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-lg shadow-sm placeholder-text-muted focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Access Command Center'}
              </button>
            </div>
            
            <div className="text-center text-xs text-text-muted mt-4">
              Demo Credentials: admin@udrms.gov / password123
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
