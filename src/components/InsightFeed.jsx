import React from 'react';
import './InsightFeed.css';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const InsightFeed = () => {
  const insights = [
    {
      id: 1,
      type: 'warning',
      title: 'Historical Conflict Detected',
      message: 'Based on 2014 flood data, Route B is prone to secondary landslides. Recommending Route C for convoy.',
      time: 'Just now',
      icon: <AlertTriangle size={18} color="var(--accent-orange)" />
    },
    {
      id: 2,
      type: 'info',
      title: 'Task De-confliction',
      message: 'UNICEF team already deployed to Sector 4 water purification. Reallocating NGO Team Alpha to Sector 7.',
      time: '2m ago',
      icon: <Info size={18} color="var(--accent-cyan)" />
    },
    {
      id: 3,
      type: 'success',
      title: 'Smart Contract Executed',
      message: 'Drone verification complete for bridge clearing. 500 USDC released to local contractor wallet.',
      time: '15m ago',
      icon: <CheckCircle size={18} color="#10b981" />
    }
  ];

  return (
    <div className="insight-feed glass-panel">
      <div className="feed-header">
        <h3>AI Insight Engine</h3>
        <span className="live-badge">LIVE</span>
      </div>
      
      <div className="feed-list">
        {insights.map(item => (
          <div key={item.id} className={`insight-card ${item.type}`}>
            <div className="card-icon">
              {item.icon}
            </div>
            <div className="card-content">
              <div className="card-header">
                <h4>{item.title}</h4>
                <span className="time">{item.time}</span>
              </div>
              <p>{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightFeed;
