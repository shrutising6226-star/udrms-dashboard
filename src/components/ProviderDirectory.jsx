import React, { useState, useEffect } from 'react';
import { Users, Phone, PlusCircle, Building2, Package, Check, X } from 'lucide-react';
import './ProviderDirectory.css';

const ProviderDirectory = () => {
  const [providers, setProviders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newResources, setNewResources] = useState('');
  const [newContactInfo, setNewContactInfo] = useState('');
  const [newStatus, setNewStatus] = useState('Available');

  useEffect(() => {
    fetch('/api/providers')
      .then(res => res.json())
      .then(data => setProviders(data))
      .catch(err => console.error('Error fetching providers:', err));
  }, []);

  const handleAddProvider = async () => {
    if (!newOrgName || !newResources || !newContactInfo) return;

    const newProvider = {
      orgName: newOrgName,
      resources: newResources,
      contactInfo: newContactInfo,
      status: newStatus
    };

    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProvider)
      });
      const data = await res.json();
      setProviders([...providers, data]);
      setShowForm(false);
      setNewOrgName('');
      setNewResources('');
      setNewContactInfo('');
      setNewStatus('Available');
    } catch (err) {
      console.error('Error posting provider:', err);
    }
  };

  const getStatusColor = (status) => {
    return status === 'Available' ? '#10b981' : 'var(--accent-orange)';
  };

  return (
    <div className="provider-directory glass-panel">
      <div className="directory-header">
        <div className="header-title">
          <Users size={24} color="var(--accent-cyan)" />
          <h3>Provider Directory</h3>
        </div>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <PlusCircle size={18} /> Register Organization
        </button>
      </div>

      <div className="directory-content">
        {showForm && (
          <div className="add-provider-form glass-panel">
            <h4>Register New Provider</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Organization Name</label>
                <input type="text" value={newOrgName} onChange={e => setNewOrgName(e.target.value)} placeholder="e.g. MSF" />
              </div>
              <div className="form-group">
                <label>Resources Provided</label>
                <input type="text" value={newResources} onChange={e => setNewResources(e.target.value)} placeholder="e.g. Medical, Food" />
              </div>
              <div className="form-group">
                <label>Contact Info (Email/Phone)</label>
                <input type="text" value={newContactInfo} onChange={e => setNewContactInfo(e.target.value)} placeholder="hello@org.com | +123456789" />
              </div>
              <div className="form-group">
                <label>Current Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="Available">Available</option>
                  <option value="Deployed">Deployed</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="icon-btn success" onClick={handleAddProvider}><Check size={18}/> Save</button>
              <button className="icon-btn danger" onClick={() => setShowForm(false)}><X size={18}/> Cancel</button>
            </div>
          </div>
        )}

        <div className="providers-grid">
          {providers.map(p => (
            <div key={p.id} className="provider-card">
              <div className="card-header">
                <div className="org-name">
                  <Building2 size={18} color="var(--accent-cyan)" />
                  <strong>{p.orgName}</strong>
                </div>
                <span className="status-badge" style={{ borderColor: getStatusColor(p.status), color: getStatusColor(p.status) }}>
                  {p.status}
                </span>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <Package size={16} color="var(--text-secondary)" />
                  <span>{p.resources}</span>
                </div>
                <div className="info-row contact-row">
                  <Phone size={16} color="var(--text-secondary)" />
                  <span>{p.contactInfo}</span>
                </div>
              </div>
            </div>
          ))}
          {providers.length === 0 && <p className="empty-state">No providers registered yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProviderDirectory;
