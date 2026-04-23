import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AppShell } from '../components/layout/AppShell';
import { AlertTriangle, BookOpen, Lightbulb, UserX, Plus, X } from 'lucide-react';
import { format } from 'date-fns';

const AnalysisView = () => {
  const { token } = useAuthStore();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    disasterType: 'FLOOD',
    region: '',
    dateOccurred: new Date().toISOString().split('T')[0],
    whatWorked: '',
    whatFailed: '',
    populationsMissed: '',
    tags: ''
  });

  const fetchAnalysis = async () => {
    try {
      const res = await fetch('/api/v1/analysis', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalyses(data);
    } catch (error) {
      console.error("Failed to fetch analyses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/v1/analysis', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      setFormData({
        disasterType: 'FLOOD', region: '', dateOccurred: new Date().toISOString().split('T')[0],
        whatWorked: '', whatFailed: '', populationsMissed: '', tags: ''
      });
      fetchAnalysis();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AppShell><div className="flex justify-center p-12">Loading Analysis Engine...</div></AppShell>;

  return (
    <AppShell>
      <div className="flex flex-col gap-6 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Smart Post-Disaster Analysis</h1>
            <p className="text-sm text-text-secondary mt-1">Structured database of lessons learned from past interventions.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Submit Post-Action Report
          </button>
        </div>

        {/* Recommendation Engine UI Mock */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-2">
          <div className="flex gap-3">
            <Lightbulb className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-indigo-900 mb-1">Recommendation Engine Active</h3>
              <p className="text-sm text-indigo-700">
                Based on current Active Deployments in <strong>Coastal Sector 4</strong>, there are <strong>{analyses.length}</strong> relevant past lessons learned regarding <strong>MEDICAL</strong> and <strong>FLOOD</strong> responses.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {analyses.map(item => (
            <div key={item.id} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-gray-500" />
                  <div>
                    <h3 className="font-bold text-text-primary text-lg">
                      {item.disasterType} Response - {item.region}
                    </h3>
                    <p className="text-xs text-text-muted">
                      Occurred: {format(new Date(item.dateOccurred), 'MMMM yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.tags.split(',').map(tag => (
                    <span key={tag} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold border border-blue-100">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-green-700 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> What Worked
                  </h4>
                  <p className="text-sm text-text-secondary">{item.whatWorked}</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-red-700 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> What Failed
                  </h4>
                  <p className="text-sm text-text-secondary">{item.whatFailed}</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-orange-700 mb-2">
                    <UserX className="w-4 h-4" /> Populations Missed
                  </h4>
                  <p className="text-sm text-text-secondary">{item.populationsMissed || 'None recorded'}</p>
                </div>
              </div>
            </div>
          ))}

          {analyses.length === 0 && (
            <div className="text-center py-12 text-text-muted">No analysis records available.</div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-surface">
                <h2 className="text-xl font-bold">Submit Post-Action Report</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Disaster Type</label>
                    <select className="w-full border p-2 rounded" value={formData.disasterType} onChange={e => setFormData({...formData, disasterType: e.target.value})}>
                      <option value="FLOOD">Flood</option>
                      <option value="EARTHQUAKE">Earthquake</option>
                      <option value="CYCLONE">Cyclone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Region/Zone</label>
                    <input required className="w-full border p-2 rounded" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} placeholder="e.g. Coastal Sector 4" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date Occurred</label>
                    <input required type="date" className="w-full border p-2 rounded" value={formData.dateOccurred} onChange={e => setFormData({...formData, dateOccurred: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags (Comma separated)</label>
                    <input required className="w-full border p-2 rounded" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="e.g. medical, rescue, food" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-green-700">What Worked Well</label>
                    <textarea required className="w-full border p-2 rounded" value={formData.whatWorked} onChange={e => setFormData({...formData, whatWorked: e.target.value})} rows="3" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-red-700">What Failed / Challenges</label>
                    <textarea required className="w-full border p-2 rounded" value={formData.whatFailed} onChange={e => setFormData({...formData, whatFailed: e.target.value})} rows="3" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-orange-700">Populations Missed</label>
                    <input className="w-full border p-2 rounded" value={formData.populationsMissed} onChange={e => setFormData({...formData, populationsMissed: e.target.value})} placeholder="e.g. Elderly in remote villages" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded font-medium hover:bg-gray-50" disabled={submitting}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 disabled:opacity-50" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
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

export default AnalysisView;
