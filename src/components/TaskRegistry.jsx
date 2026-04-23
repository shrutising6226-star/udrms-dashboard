import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckSquare, PlusCircle, X, Check } from 'lucide-react';
import './TaskRegistry.css';

const TaskRegistry = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newZone, setNewZone] = useState('');
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return '#10b981'; // Green
      case 'In Progress': return 'var(--accent-cyan)'; // Blue
      case 'Claimed': return 'var(--accent-orange)'; // Orange
      case 'Open Needs': return '#ef4444'; // Red
      default: return 'var(--text-secondary)';
    }
  };

  const handlePostNeedClick = () => {
    setShowForm(true);
  };

  const submitNeed = async () => {
    if (!newZone.trim() || !newTaskText.trim()) return;

    const newTask = {
      org: 'Unclaimed',
      zone: newZone,
      task: newTaskText,
      status: 'Open Needs'
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      const data = await res.json();
      setTasks([...tasks, data]);
      setShowForm(false);
      setNewZone('');
      setNewTaskText('');
    } catch (err) {
      console.error('Error posting need:', err);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="task-registry glass-panel">
      <div className="registry-header">
        <div className="header-title">
          <ClipboardList size={20} color="var(--accent-cyan)" />
          <h3>Task & Needs Registry</h3>
        </div>
        <button className="add-task-btn" onClick={handlePostNeedClick}>
          <PlusCircle size={16} /> Post Need
        </button>
      </div>

      <div className="table-container">
        <table className="registry-table">
          <thead>
            <tr>
              <th>Zone/Location</th>
              <th>Task / Need</th>
              <th>Assigned NGO/Gov</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {showForm && (
              <tr className="form-row">
                <td>
                  <input 
                    type="text" 
                    value={newZone} 
                    onChange={e => setNewZone(e.target.value)} 
                    placeholder="e.g. Sector 7" 
                    className="inline-input" 
                    autoFocus
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    value={newTaskText} 
                    onChange={e => setNewTaskText(e.target.value)} 
                    placeholder="e.g. Medical Supplies" 
                    className="inline-input" 
                  />
                </td>
                <td className="unclaimed">Unclaimed</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={submitNeed} className="icon-btn success" title="Submit">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setShowForm(false)} className="icon-btn danger" title="Cancel">
                    <X size={16} />
                  </button>
                </td>
              </tr>
            )}
            {tasks.map(t => (
              <tr key={t.id}>
                <td className="zone-cell">{t.zone}</td>
                <td>{t.task}</td>
                <td className={t.org === 'Unclaimed' ? 'unclaimed' : 'org-cell'}>{t.org}</td>
                <td>
                  <div className="status-badge" style={{ borderColor: getStatusColor(t.status), color: getStatusColor(t.status) }}>
                    {t.status === 'Completed' && <CheckSquare size={14} style={{ marginRight: '4px' }}/>}
                    <select 
                      value={t.status} 
                      onChange={(e) => updateTaskStatus(t.id, e.target.value)}
                      className="status-select"
                      style={{ color: getStatusColor(t.status) }}
                    >
                      <option value="Open Needs">Open Needs</option>
                      <option value="Claimed">Claimed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && !showForm && (
              <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Loading tasks...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskRegistry;
