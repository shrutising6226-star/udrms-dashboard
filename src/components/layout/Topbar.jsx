import React from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../../store/authStore';

export const Topbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex-1 flex items-center">
        {/* Breadcrumb placeholder */}
        <div className="text-sm font-medium text-text-secondary">Dashboard</div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-1.5 border border-border rounded-lg bg-background text-sm placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Search employees, documents..."
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-4">
        <button className="relative p-1.5 text-text-secondary hover:text-primary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <button className="p-1.5 text-text-secondary hover:text-primary transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-border mx-1"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-text-primary">{user?.name}</div>
            <div className="text-xs text-text-secondary">{user?.role?.replace('_', ' ')}</div>
          </div>
          <Avatar src={user?.avatarUrl} name={user?.name} size="md" />
          <button onClick={logout} className="p-1.5 text-text-secondary hover:text-red-500 transition-colors ml-2" title="Logout">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
