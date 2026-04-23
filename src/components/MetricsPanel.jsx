import React, { useState, useEffect } from 'react';
import './MetricsPanel.css';
import { BarChart3, Activity } from 'lucide-react';

const MetricsPanel = () => {
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    claimed: 0,
    open: 0,
    total: 0
  });

  useEffect(() => {
    // Poll the tasks endpoint every few seconds to keep the graph live
    const fetchStats = () => {
      fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
          const counts = {
            completed: data.filter(t => t.status === 'Completed').length,
            inProgress: data.filter(t => t.status === 'In Progress').length,
            claimed: data.filter(t => t.status === 'Claimed').length,
            open: data.filter(t => t.status === 'Open Needs').length,
            total: data.length
          };
          setStats(counts);
        })
        .catch(err => console.error(err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getPercentage = (val) => stats.total === 0 ? 0 : Math.round((val / stats.total) * 100);

  return (
    <div className="metrics-panel glass-panel">
      <div className="metrics-header">
        <BarChart3 size={20} color="var(--accent-orange)" />
        <h3>Live Recovery Metrics</h3>
      </div>
      
      <div className="metrics-content">
        <div className="chart-container">
          <div className="bar-row">
            <div className="bar-label">Completed</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${getPercentage(stats.completed)}%`, background: '#10b981' }}></div>
            </div>
            <div className="bar-value">{stats.completed}</div>
          </div>
          
          <div className="bar-row">
            <div className="bar-label">In Progress</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${getPercentage(stats.inProgress)}%`, background: 'var(--accent-cyan)' }}></div>
            </div>
            <div className="bar-value">{stats.inProgress}</div>
          </div>
          
          <div className="bar-row">
            <div className="bar-label">Claimed</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${getPercentage(stats.claimed)}%`, background: 'var(--accent-orange)' }}></div>
            </div>
            <div className="bar-value">{stats.claimed}</div>
          </div>

          <div className="bar-row">
            <div className="bar-label">Open Needs</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${getPercentage(stats.open)}%`, background: '#ef4444' }}></div>
            </div>
            <div className="bar-value">{stats.open}</div>
          </div>
        </div>

        <div className="mini-stats">
          <div className="stat-box">
            <Activity size={16} color="var(--accent-cyan)"/>
            <div className="stat-info">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-desc">Total Tracked</span>
            </div>
          </div>
          <div className="stat-box">
            <BarChart3 size={16} color="#10b981"/>
            <div className="stat-info">
              <span className="stat-num">{getPercentage(stats.completed)}%</span>
              <span className="stat-desc">Resolution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
