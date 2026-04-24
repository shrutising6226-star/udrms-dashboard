import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Map, Database, Users, AlertTriangle, ArrowRightLeft } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/registry', icon: LayoutDashboard },
    { name: 'Resource Market', path: '/resources', icon: ArrowRightLeft },
    { name: 'Fund Map', path: '/map', icon: Map },
    { name: 'Agencies', path: '/agencies', icon: Users },
    { name: 'Post-Disaster Analysis', path: '/analysis', icon: AlertTriangle }
  ];

  const [duplicatedCount, setDuplicatedCount] = React.useState(0);
  const token = localStorage.getItem('teamhub_token');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) {
      fetch('/api/v1/dashboard/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setDuplicatedCount(data.duplicatedCount || 0))
      .catch(err => console.error(err));
    }
  }, [token]);

  return (
    <div className="w-[240px] bg-surface h-screen flex flex-col border-r border-border fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-border bg-blue-50">
        <ShieldAlert className="w-6 h-6 text-blue-600 mr-2" />
        <span className="font-bold text-lg text-blue-900 tracking-tight">ReliefSync</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-text-secondary hover:bg-blue-50 hover:text-blue-700'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </div>

      {duplicatedCount > 0 && (
        <div className="p-4 border-t border-border mt-auto">
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 shadow-sm">
            <h4 className="font-bold text-sm mb-1 text-orange-800">Coordination Required</h4>
            <p className="text-xs mb-3 text-orange-600">{duplicatedCount} Overlapping intervention{duplicatedCount !== 1 ? 's' : ''} detected.</p>
            <button 
              onClick={() => navigate('/registry')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" /> Review Duplications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
