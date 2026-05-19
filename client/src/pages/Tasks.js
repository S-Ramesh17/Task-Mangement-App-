// pages/Tasks.js - Student task viewer (read-only)

import { useEffect, useState } from 'react';
import { getTasks } from '../services/api';
import Navbar from '../components/Navbar';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadTasks = () => {
    getTasks().then((data) => {
      if (Array.isArray(data)) setTasks(data);
      setLoading(false);
    });
  };

  useEffect(loadTasks, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getDeadlineColor = (deadline, status) => {
    if (!deadline || status === 'completed') return 'var(--text-muted)';
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'var(--danger)';
    if (days <= 2) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>📋 My Tasks</h2>
          <p>
            {tasks.length} total ·{" "}
            {tasks.filter(t => t.status === 'pending').length} pending
          </p>
        </div>

        <div style={{
          background: 'var(--primary-light)',
          color: 'var(--primary-dark)',
          borderRadius: 8,
          padding: '10px 16px',
          fontSize: '0.85rem',
          marginBottom: 20,
          fontWeight: 500
        }}>
          ℹ️ Tasks are assigned to you by your admin. Contact your admin for any changes.
        </div>

        <div className="filter-tabs">
          {['all', 'pending', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && ` (${tasks.length})`}
              {f === 'pending' && ` (${tasks.filter(t => t.status === 'pending').length})`}
              {f === 'completed' && ` (${tasks.filter(t => t.status === 'completed').length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No {filter !== 'all' ? filter : ''} tasks found.</p>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task._id} className={`task-item ${task.status}`}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background:
                      task.status === 'completed'
                        ? 'var(--success)'
                        : 'var(--warning)',
                    flexShrink: 0
                  }}
                />

                <div className="task-info">
                  <span
                    className={`task-title ${
                      task.status === 'completed' ? 'strikethrough' : ''
                    }`}
                  >
                    {task.title}
                  </span>

                  {task.description && (
                    <span className="task-meta">{task.description}</span>
                  )}

                  <div
                    className="task-meta"
                    style={{ display: 'flex', gap: 12, marginTop: 3 }}
                  >
                    {task.deadline && (
                      <span
                        style={{
                          color: getDeadlineColor(task.deadline, task.status),
                          fontWeight: 600
                        }}
                      >
                        📅 Due: {formatDate(task.deadline)}
                      </span>
                    )}

                    {task.createdBy?.email && (
                      <span>Assigned by: {task.createdBy.email}</span>
                    )}
                  </div>
                </div>

                <span className={`badge badge-${task.status}`}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}