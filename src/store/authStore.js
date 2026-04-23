import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('teamhub_token') || null,
  isAuthenticated: !!localStorage.getItem('teamhub_token'),
  isCheckingAuth: true,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('Could not connect to the backend server. It might be offline.');
      }
      
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('teamhub_token', data.token);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('teamhub_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('teamhub_token');
    if (!token) {
      set({ isAuthenticated: false, user: null, isCheckingAuth: false });
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Token invalid');
      const data = await res.json();
      set({ user: data, isAuthenticated: true, isCheckingAuth: false });
    } catch (err) {
      localStorage.removeItem('teamhub_token');
      set({ isAuthenticated: false, user: null, token: null, isCheckingAuth: false });
    }
  }
}));
