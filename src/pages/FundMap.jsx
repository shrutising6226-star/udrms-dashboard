import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AppShell } from '../components/layout/AppShell';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Use a custom SVG icon instead of external images to prevent tracking blockers from interfering
const customIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563EB" width="32px" height="32px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  className: 'custom-leaflet-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const FundMap = () => {
  const { token } = useAuthStore();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHeatmap, setIsHeatmap] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/v1/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [token]);

  if (loading) return <AppShell><div className="flex justify-center p-12">Loading Map...</div></AppShell>;

  return (
    <AppShell>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Geo-tagged Deployments</h1>
            <p className="text-sm text-text-secondary mt-1">Live Map of all planned and active field interventions.</p>
          </div>
          <button 
            onClick={() => setIsHeatmap(!isHeatmap)} 
            className={`px-4 py-2 font-bold rounded-lg text-sm transition-colors ${isHeatmap ? 'bg-red-100 text-red-600 border border-red-200 hover:bg-red-200' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
          >
            {isHeatmap ? '🔥 Heatmap Active' : '📍 Switch to Heatmap'}
          </button>
        </div>

        <div className="flex-1 bg-surface rounded-xl shadow-sm border border-border overflow-hidden min-h-[600px]">
          <MapContainer center={[19.0760, 72.8777]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={isHeatmap ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            />
            {activities.map(activity => (
              isHeatmap ? (
                <CircleMarker 
                  key={`heat-${activity.id}`} 
                  center={[activity.latitude, activity.longitude]} 
                  radius={40} 
                  pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3, stroke: false }} 
                />
              ) : (
                <Marker key={activity.id} position={[activity.latitude, activity.longitude]} icon={customIcon}>
                  <Popup>
                    <div className="font-sans">
                      <h3 className="font-bold text-sm mb-1">{activity.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{activity.agency.name}</p>
                      <div className="text-xs mb-1"><b>Status:</b> {activity.status}</div>
                      <div className="text-xs mb-1"><b>Budget:</b> ₹{activity.budget.toLocaleString()}</div>
                      {activity.isDuplicated && (
                        <div className="mt-2 text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">
                          ⚠️ Overlap Flagged
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>
      </div>
    </AppShell>
  );
};

export default FundMap;
