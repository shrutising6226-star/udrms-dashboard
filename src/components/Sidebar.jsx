import React from 'react';
import { Home, Map, Database, Activity, Users, Settings, LogOut, Network } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, onChangeTab, onExit }) => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <Network size={24} color="var(--accent-cyan)" />
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => onChangeTab('overview')}
        >
          <Home size={20} />
          <span className="tooltip">Overview</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => onChangeTab('insights')}
        >
          <Activity size={20} />
          <span className="tooltip">Insights</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'providers' ? 'active' : ''}`}
          onClick={() => onChangeTab('providers')}
        >
          <Users size={20} />
          <span className="tooltip">Providers</span>
        </button>
        <button className="nav-item">
          <Map size={20} />
          <span className="tooltip">Mesh Map</span>
        </button>
        <button className="nav-item">
          <Database size={20} />
          <span className="tooltip">Ledger</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} />
        </button>
        <button className="nav-item exit" onClick={onExit}>
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
