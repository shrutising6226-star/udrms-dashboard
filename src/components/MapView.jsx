import React, { useState, useEffect } from 'react';
import './MapView.css';
import { Droplets, HeartPulse, Tent, MapPin } from 'lucide-react';

const MapView = () => {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetch('/api/deployments')
      .then(res => res.json())
      .then(data => setRegions(data))
      .catch(err => console.error('Error fetching deployments:', err));
  }, []);

  const getIcon = (supply) => {
    switch(supply) {
      case 'Water': return <Droplets size={20} />;
      case 'Shelter': return <Tent size={20} />;
      case 'Medical': return <HeartPulse size={20} />;
      default: return <MapPin size={20} />;
    }
  };

  return (
    <div className="map-view glass-panel">
      <div className="map-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <MapPin size={20} color="var(--accent-cyan)" />
          <h3>Active Deployment Map</h3>
        </div>
        <div className="legend">
          <span className="legend-item"><Droplets size={14}/> Water</span>
          <span className="legend-item"><Tent size={14}/> Shelter</span>
          <span className="legend-item"><HeartPulse size={14}/> Medical</span>
        </div>
      </div>
      
      <div className="map-container practical-map">
        {regions.map(region => (
          <div 
            key={region.id} 
            className={`map-region ${region.isNeed ? 'need' : 'active'}`}
            style={{ left: `${region.x}%`, top: `${region.y}%` }}
          >
            <div className="region-marker">
              {getIcon(region.supply)}
            </div>
            <div className="region-label">
              <strong>{region.name}</strong>
              <span>{region.org}</span>
            </div>
            {region.isNeed && <div className="node-ping red"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;
