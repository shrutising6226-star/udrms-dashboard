import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AppShell } from '../components/layout/AppShell';
import { AlertTriangle, CheckCircle2, MapPin, Building, Users, IndianRupee, Plus, X, BarChart3, PieChart as PieChartIcon, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const RegistryDashboard = () => {
  const { token, user } = useAuthStore();
  const [activities, setActivities] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterZone, setFilterZone] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [formData, setFormData] = useState({
    title: '', activityType: 'MEDICAL', description: '', zone: '',
    locationName: '', budget: '', beneficiaries: ''
  });

  const fetchData = async () => {
    try {
      const [actRes, lessonRes] = await Promise.all([
        fetch('/api/v1/activities', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/v1/analysis', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setActivities(await actRes.json());
      setLessons(await lessonRes.json());
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    setGeocoding(true);
    try {
      // 1. Geocode the location name using OpenStreetMap Nominatim
      let latitude = 0;
      let longitude = 0;
      if (formData.locationName) {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.locationName)}&format=json&limit=1`);
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          latitude = parseFloat(geoData[0].lat);
          longitude = parseFloat(geoData[0].lon);
        } else {
          alert(`Could not find coordinates for "${formData.locationName}". Defaulting to 0,0.`);
        }
      }

      // 2. Fetch agency info
      const res = await fetch('/api/v1/agencies', { headers: { 'Authorization': `Bearer ${token}` } });
      const agencies = await res.json();
      const myAgency = agencies.find(a => a.name === user.agencyName) || agencies[0];

      // 3. Submit to backend
      await fetch('/api/v1/activities', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          agencyId: myAgency.id,
          latitude: latitude,
          longitude: longitude,
          budget: parseFloat(formData.budget),
          beneficiaries: parseInt(formData.beneficiaries)
        })
      });
      setShowModal(false);
      setFormData({ title: '', activityType: 'MEDICAL', description: '', zone: '', locationName: '', budget: '', beneficiaries: '' });
      fetchData(); // Refresh to see duplicates
    } catch (err) {
      console.error(err);
    } finally {
      setGeocoding(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await fetch(`/api/v1/activities/${id}/resolve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData(); // Refresh list to clear warnings
    } catch (err) {
      console.error("Failed to resolve", err);
    }
  };

  const filteredActivities = activities.filter(a => {
    if (filterZone !== 'All' && a.zone !== filterZone) return false;
    if (filterType !== 'All' && a.activityType !== filterType) return false;
    return true;
  });

  const uniqueZones = [...new Set(activities.map(a => a.zone))];
  const uniqueTypes = [...new Set(activities.map(a => a.activityType))];

  // --- CHART DATA PREPARATION ---
  // 1. Budget by Agency
  const budgetByAgency = filteredActivities.reduce((acc, curr) => {
    const agency = curr.agency.name;
    acc[agency] = (acc[agency] || 0) + curr.budget;
    return acc;
  }, {});
  const barChartData = Object.keys(budgetByAgency).map(key => ({ name: key, budget: budgetByAgency[key] }));

  // 2. Activities by Type
  const activitiesByType = filteredActivities.reduce((acc, curr) => {
    const type = curr.activityType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const pieChartData = Object.keys(activitiesByType).map(key => ({ name: key, value: activitiesByType[key] }));
  const COLORS = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#9333EA'];

  const relevantLessons = lessons.filter(l => 
    (formData.zone && l.region.toLowerCase().includes(formData.zone.toLowerCase())) || 
    (formData.activityType && l.tags.toLowerCase().includes(formData.activityType.toLowerCase()))
  );

  if (loading) return <AppShell><div className="flex justify-center p-12">Loading Registry...</div></AppShell>;

  return (
    <AppShell>
      <div className="flex flex-col gap-6 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Activity Registry</h1>
            <p className="text-sm text-text-secondary mt-1">Central dashboard for all inter-agency deployments and deduplication checks.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Log New Activity
          </button>
        </div>

        {/* Analytics Section */}
        {filteredActivities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-surface p-5 rounded-xl shadow-sm border border-border">
              <h3 className="text-sm font-bold text-text-secondary mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Allocated Budgets by Agency
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                    <YAxis tick={{fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                    <RechartsTooltip cursor={{fill: '#F1F5F9'}} formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="budget" radius={[4, 4, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-surface p-5 rounded-xl shadow-sm border border-border">
              <h3 className="text-sm font-bold text-text-secondary mb-4 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" /> Activity Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-surface p-4 rounded-xl shadow-sm border border-border flex gap-4">
          <select value={filterZone} onChange={e => setFilterZone(e.target.value)} className="border border-border rounded-md px-3 py-1.5 text-sm outline-none">
            <option value="All">All Zones</option>
            {uniqueZones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-border rounded-md px-3 py-1.5 text-sm outline-none">
            <option value="All">All Activity Types</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid gap-4">
          {filteredActivities.map(activity => (
            <div key={activity.id} className={`bg-surface p-5 rounded-xl border transition-all ${activity.isDuplicated ? 'border-orange-300 shadow-[0_0_15px_rgba(251,146,60,0.1)]' : 'border-border shadow-sm'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded uppercase">{activity.activityType}</span>
                    <h3 className="text-lg font-bold text-text-primary">{activity.title}</h3>
                  </div>
                  <div className="flex items-center text-sm text-text-secondary gap-4">
                    <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {activity.agency.name}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {activity.zone}</span>
                  </div>
                </div>
                
                {activity.isDuplicated ? (
                  <div className="flex items-center gap-1.5 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <AlertTriangle className="w-4 h-4" /> Flagged Duplication
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Cleared
                  </div>
                )}
              </div>
              
              <p className="text-sm text-text-primary mb-4">{activity.description}</p>
              
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-text-muted font-medium mb-0.5">Budget</p>
                  <p className="text-sm font-bold flex items-center"><IndianRupee className="w-3 h-3 mr-0.5"/> {activity.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium mb-0.5">Beneficiaries</p>
                  <p className="text-sm font-bold flex items-center"><Users className="w-3 h-3 mr-1"/> {activity.beneficiaries.toLocaleString()}</p>
                </div>
                <div className="col-span-2 pl-4 border-l border-gray-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 uppercase">Logistics: {activity.supplyStage}</span>
                    <span className="text-xs font-bold text-blue-600">{activity.completionPct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{width: `${activity.completionPct}%`}}></div>
                  </div>
                </div>
              </div>

              {activity.isDuplicated && (
                <div className="mt-4 bg-orange-50 p-3 rounded-lg border border-orange-100 flex justify-between items-start gap-4">
                  <div className="text-sm text-orange-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{activity.duplicateNotes}</p>
                  </div>
                  <button 
                    onClick={() => handleResolve(activity.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-md whitespace-nowrap"
                  >
                    Resolve & Clear
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-text-muted">No activities found matching filters.</div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-surface">
                <h2 className="text-xl font-bold">Log New Activity</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitActivity} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input required className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Relief Camp" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Activity Type</label>
                    <select className="w-full border p-2 rounded" value={formData.activityType} onChange={e => setFormData({...formData, activityType: e.target.value})}>
                      <option value="MEDICAL">Medical</option>
                      <option value="SHELTER">Shelter</option>
                      <option value="FOOD">Food & Water</option>
                      <option value="INFRASTRUCTURE">Infrastructure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zone Group (for Filtering)</label>
                    <input required className="w-full border p-2 rounded" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} placeholder="e.g. Sector 4" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Specific Location Name</label>
                    <input required className="w-full border p-2 rounded" value={formData.locationName} onChange={e => setFormData({...formData, locationName: e.target.value})} placeholder="e.g. Mumbai, India" />
                    <p className="text-xs text-text-muted mt-1">This will automatically be geocoded to coordinates on the map.</p>
                  </div>
                  
                  {relevantLessons.length > 0 && formData.zone && (
                    <div className="col-span-2 bg-blue-50 border border-blue-200 p-4 rounded-xl mt-2 shadow-inner">
                      <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5"/> Shadow Planning: Lessons from the Past</h4>
                      <p className="text-xs text-blue-700 mb-2">Based on your selected Zone ({formData.zone}) and Type ({formData.activityType}), here are relevant historical insights:</p>
                      <ul className="text-sm text-blue-900 space-y-3">
                        {relevantLessons.map(l => (
                          <li key={l.id} className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                            <p className="mb-1"><span className="font-bold text-red-600">Warning:</span> {l.whatFailed}</p>
                            <p><span className="font-bold text-green-700">Recommendation:</span> {l.whatWorked}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea required className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget (₹)</label>
                    <input required type="number" className="w-full border p-2 rounded" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Target Beneficiaries</label>
                    <input required type="number" className="w-full border p-2 rounded" value={formData.beneficiaries} onChange={e => setFormData({...formData, beneficiaries: e.target.value})} />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded font-medium hover:bg-gray-50" disabled={geocoding}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50" disabled={geocoding}>
                    {geocoding ? 'Finding Coordinates...' : 'Submit to Registry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default RegistryDashboard;
