// pages/Dashboard.js - Student dashboard with task stats

import { useEffect, useState } from 'react';
import { getTasks } from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  })();

  useEffect(() => {
    getTasks().then((data) => {
      if (Array.isArray(data)) setTasks(data);
      setLoading(false);
    });
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Find tasks with upcoming deadlines
  const upcoming = tasks.filter(t => {
    if (!t.deadline || t.status === 'completed') return false;
    const days = Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 3;
  });

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>Welcome back, <span className="highlight">{user.email}</span> 👋</h2>
          <p>Here's your task overview for today</p>
        </div>

        {loading ? (
          <div className="loading">Loading your tasks...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card stat-total">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{total}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
              <div className="stat-card stat-completed">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{completed}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card stat-pending">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">{pending}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-card stat-rate">
                <div className="stat-icon">📈</div>
                <div className="stat-value">{completionRate}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
            </div>

            {/* Progress bar */}
            {total > 0 && (
              <div className="progress-section">
                <div className="progress-label">
                  <span>Overall Progress</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completionRate}%` }} />
                </div>
              </div>
            )}

            {/* Upcoming deadlines */}
            {upcoming.length > 0 && (
              <div className="section-card" style={{ borderLeft: '4px solid var(--danger)', marginBottom: 20 }}>
                <h3>⚠️ Deadlines Soon</h3>
                {upcoming.map(t => {
                  const days = Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.title}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--danger)', fontWeight: 600 }}>
                        {days === 0 ? 'Due today!' : `${days} day${days > 1 ? 's' : ''} left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Links */}
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <Link to="/tasks" className="btn btn-primary">📋 View My Tasks</Link>
              </div>
            </div>

            {/* Empty state */}
            {total === 0 && (
              <div className="empty-state" style={{ marginTop: 20 }}>
                <div className="empty-state-icon">📭</div>
                <p>No tasks assigned to you yet.</p>
                <p style={{ marginTop: 6, fontSize: '0.82rem' }}>Your admin will assign tasks to you soon.</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
