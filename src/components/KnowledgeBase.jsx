import React, { useState, useEffect } from 'react';
import './KnowledgeBase.css';
import { Search, FileText, AlertCircle, Lightbulb } from 'lucide-react';

const KnowledgeBase = () => {
  const [query, setQuery] = useState('');
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error('Error fetching lessons:', err));
  }, []);

  const filtered = lessons.filter(l => 
    l.insight.toLowerCase().includes(query.toLowerCase()) || 
    l.disaster.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="knowledge-base glass-panel">
      <div className="kb-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <FileText size={20} color="var(--accent-cyan)" />
          <h3>Lessons Learned Hub</h3>
        </div>
        <p className="kb-subtitle">Search insights extracted from past PDF reports.</p>
      </div>

      <div className="search-bar-container">
        <Search size={18} className="search-icon" color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search past disasters (e.g., floods, medical)..." 
          className="kb-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      <div className="kb-list">
        {filtered.map(item => (
          <div key={item.id} className="kb-card">
            <div className="kb-card-header">
              <span className="kb-disaster-name">{item.disaster}</span>
              {item.type === 'warning' && <AlertCircle size={16} color="#ef4444" />}
              {item.type === 'recommendation' && <Lightbulb size={16} color="var(--accent-orange)" />}
              {item.type === 'observation' && <FileText size={16} color="var(--accent-cyan)" />}
            </div>
            <p>{item.insight}</p>
          </div>
        ))}
        {lessons.length > 0 && filtered.length === 0 && (
          <p style={{color: 'var(--text-secondary)', padding: '1rem', textAlign: 'center'}}>No lessons found.</p>
        )}
        {lessons.length === 0 && (
          <p style={{color: 'var(--text-secondary)', padding: '1rem', textAlign: 'center'}}>Loading database...</p>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
