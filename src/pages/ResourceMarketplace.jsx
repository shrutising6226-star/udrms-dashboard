import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AppShell } from '../components/layout/AppShell';
import { Package, HandHeart, Plus, MapPin, Building, ArrowRightLeft } from 'lucide-react';

const ResourceMarketplace = () => {
  const { token, user } = useAuthStore();
  const [inventory, setInventory] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'needs'
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('inventory');
  const [requestedItems, setRequestedItems] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [formData, setFormData] = useState({
    resourceName: '',
    category: 'MEDICAL',
    quantity: '',
    unit: 'pieces',
    location: '',
    urgency: 'HIGH'
  });

  const fetchData = async () => {
    try {
      const [invRes, needsRes] = await Promise.all([
        fetch('/api/v1/resources/inventory', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/v1/resources/needs', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setInventory(await invRes.json());
      setNeeds(await needsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = modalType === 'inventory' ? '/api/v1/resources/inventory' : '/api/v1/resources/needs';
    
    const res = await fetch('/api/v1/agencies', { headers: { 'Authorization': `Bearer ${token}` } });
    const agencies = await res.json();
    const myAgency = agencies.find(a => a.name === user.agencyName) || agencies[0];

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agencyId: myAgency.id,
          quantity: parseInt(formData.quantity)
        })
      });
      setShowModal(false);
      setFormData({ resourceName: '', category: 'MEDICAL', quantity: '', unit: 'pieces', location: '', urgency: 'HIGH' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <AppShell><div className="p-12 text-center">Loading Marketplace...</div></AppShell>;

  const handleRequest = (need, match) => {
    setRequestedItems(prev => ({
      ...prev,
      [`${need.id}-${match.id}`]: true
    }));
    
    setPendingRequests(prev => [...prev, {
      resourceName: match.resourceName,
      quantity: match.quantity,
      unit: match.unit,
      fromAgency: match.agency?.name,
      toAgency: need.agency?.name,
      location: match.location
    }]);
  };

  // Match Engine Logic: Simple exact string match on resourceName or Category + Location overlap
  const getMatchesForNeed = (need) => {
    return inventory.filter(inv => 
      (inv.resourceName.toLowerCase().includes(need.resourceName.toLowerCase()) || inv.category === need.category) 
      && inv.location === need.location
    );
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2"><ArrowRightLeft className="w-6 h-6 text-blue-600"/> Resource Marketplace</h1>
            <p className="text-sm text-text-secondary mt-1">Bridge the gap between available resources and active ground needs.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setModalType('inventory'); setShowModal(true); }} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center gap-2 hover:bg-blue-700">
              <Package className="w-4 h-4" /> Log Inventory
            </button>
            <button onClick={() => { setModalType('need'); setShowModal(true); }} className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center gap-2 hover:bg-orange-700">
              <HandHeart className="w-4 h-4" /> Log Need
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NEEDS COLUMN */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-[75vh]">
            <div className="bg-orange-50 border-b border-orange-100 p-4">
              <h2 className="font-bold text-orange-900 flex items-center gap-2"><HandHeart className="w-5 h-5"/> Active Ground Needs</h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-50">
              {needs.map(need => {
                const matches = getMatchesForNeed(need);
                return (
                  <div key={need.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{need.resourceName} <span className="text-sm font-normal text-gray-500">({need.quantity} {need.unit})</span></h3>
                      <span className={`text-xs px-2 py-1 font-bold rounded ${need.urgency === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        {need.urgency}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 gap-4 mb-3">
                      <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {need.agency?.name}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {need.location}</span>
                    </div>
                    
                    {matches.length > 0 && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-md mt-2">
                        <p className="text-xs font-bold text-green-800 mb-2 uppercase">Suggested Matches Found!</p>
                        {matches.map(m => {
                          const isRequested = requestedItems[`${need.id}-${m.id}`];
                          return (
                            <div key={m.id} className="text-sm flex justify-between items-center text-green-900 bg-white p-2 rounded border border-green-100 mb-1">
                              <span><b>{m.agency?.name}</b> has {m.quantity} {m.unit} in {m.location}</span>
                              <button 
                                onClick={() => handleRequest(need, m)}
                                disabled={isRequested}
                                className={`text-xs text-white px-2 py-1 rounded transition-colors ${isRequested ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                              >
                                {isRequested ? 'Requested ✓' : 'Request'}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
              {needs.length === 0 && <p className="text-center text-gray-500 py-8">No active needs logged.</p>}
            </div>
          </div>

          {/* INVENTORY COLUMN */}
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-[75vh]">
            <div className="bg-blue-50 border-b border-blue-100 p-4">
              <h2 className="font-bold text-blue-900 flex items-center gap-2"><Package className="w-5 h-5"/> Available Inventory</h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-50">
              {inventory.map(inv => (
                <div key={inv.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{inv.resourceName}</h3>
                    <div className="flex items-center text-sm text-gray-600 gap-4 mt-1">
                      <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {inv.agency?.name}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {inv.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-600">{inv.quantity}</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold">{inv.unit}</p>
                  </div>
                </div>
              ))}
              {inventory.length === 0 && <p className="text-center text-gray-500 py-8">No inventory logged.</p>}
            </div>
          </div>
        </div>

        {pendingRequests.length > 0 && (
          <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden mt-2">
            <div className="bg-gray-100 border-b border-gray-200 p-4">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">Pending Resource Transfers</h2>
            </div>
            <div className="p-4 space-y-2">
              {pendingRequests.map((req, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 border rounded shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Requesting {req.quantity} {req.unit} of {req.resourceName}</p>
                    <p className="text-xs text-gray-600 mt-1">From <b>{req.fromAgency}</b> to <b>{req.toAgency}</b> in {req.location}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200 animate-pulse">
                    Pending Approval
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'inventory' ? 'Log Available Inventory' : 'Log Resource Need'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Resource Name</label>
                <input required className="w-full border p-2 rounded" value={formData.resourceName} onChange={e => setFormData({...formData, resourceName: e.target.value})} placeholder="e.g. Blankets, Vaccines" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input required type="number" className="w-full border p-2 rounded" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input required className="w-full border p-2 rounded" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="e.g. pieces, kg, boxes" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="MEDICAL">Medical</option>
                    <option value="SHELTER">Shelter</option>
                    <option value="FOOD">Food</option>
                    <option value="WATER">Water</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location Zone</label>
                  <input required className="w-full border p-2 rounded" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Coastal Sector 4" />
                </div>
              </div>
              {modalType === 'need' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Urgency</label>
                  <select className="w-full border p-2 rounded" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default ResourceMarketplace;
