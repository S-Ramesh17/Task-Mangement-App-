// pages/Admin.js - Admin panel: stats, users, task management

import { useEffect, useState } from 'react';
import {
  getAdminStats, getAdminUsers, deleteUser,
  getTasks, createTask, deleteTask
} from '../services/api';
import Navbar from '../components/Navbar';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [taskError, setTaskError] = useState('');
  const [taskSuccess, setTaskSuccess] = useState('');
  const [creating, setCreating] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [s, u, t] = await Promise.all([getAdminStats(), getAdminUsers(), getTasks()]);
    if (s && s.totalTasks !== undefined) setStats(s);
    if (Array.isArray(u)) setUsers(u);
    if (Array.isArray(t)) setTasks(t);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  // Only students available for task assignment
  const students = users.filter(u => u.role === 'student');

  const handleCreateTask = async () => {
    setTaskError('');
    setTaskSuccess('');
    if (!taskTitle.trim()) return setTaskError('Task title is required');
    if (!assignedTo) return setTaskError('Please select a student to assign');

    setCreating(true);
    const result = await createTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      deadline: taskDeadline || null,
      assignedTo
    });

    if (result._id) {
      setTaskSuccess(`Task "${result.title}" created successfully!`);
      setTaskTitle(''); setTaskDesc(''); setTaskDeadline(''); setAssignedTo('');
      loadAll();
    } else {
      setTaskError(result.message || 'Failed to create task');
    }
    setCreating(false);
  };

  const handleDeleteUser = async (id, email) => {
    if (!window.confirm(`Delete user "${email}"? This will also remove all their tasks.`)) return;
    await deleteUser(id);
    loadAll();
  };

  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Delete task "${title}"?`)) return;
    await deleteTask(id);
    loadAll();
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const tabs = ['overview', 'users', 'tasks'];

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>🛡️ Admin Panel</h2>
          <p>Manage all users and tasks</p>
        </div>

        {loading ? (
          <div className="loading">Loading admin data...</div>
        ) : (
          <>
            {/* Tab Nav */}
            <div className="filter-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'overview' && '📊 '}
                  {tab === 'users' && '👥 '}
                  {tab === 'tasks' && '📋 '}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && stats && (
              <div className="stats-grid">
                <div className="stat-card stat-total">
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Students</div>
                </div>
                <div className="stat-card stat-total">
                  <div className="stat-icon">📋</div>
                  <div className="stat-value">{stats.totalTasks}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card stat-completed">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{stats.completedTasks}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card stat-pending">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-value">{stats.pendingTasks}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {activeTab === 'users' && (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No users found</td></tr>
                    ) : users.map((u, i) => (
                      <tr key={u._id}>
                        <td>{i + 1}</td>
                        <td><strong>{u.email}</strong></td>
                        <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                        <td>{formatDate(u.createdAt)}</td>
                        <td>
                          {u.role !== 'admin' && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteUser(u._id, u.email)}
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── TASKS TAB ── */}
            {activeTab === 'tasks' && (
              <>
                {/* Create Task Form */}
                <div className="task-form-card">
                  <h3>➕ Create & Assign New Task</h3>

                  {taskError && <div className="alert alert-error">{taskError}</div>}
                  {taskSuccess && <div className="alert alert-success">{taskSuccess}</div>}

                  <div className="form-row">
                    <div className="form-group">
                      <label>Task Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Complete the report"
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Assign To (Student) *</label>
                      <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                        <option value="">-- Select Student --</option>
                        {students.map(u => (
                          <option key={u._id} value={u._id}>{u.email}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Description (optional)</label>
                      <input
                        type="text"
                        placeholder="Brief description..."
                        value={taskDesc}
                        onChange={e => setTaskDesc(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Deadline (optional)</label>
                      <input
                        type="date"
                        value={taskDeadline}
                        onChange={e => setTaskDeadline(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleCreateTask}
                    disabled={creating}
                  >
                    {creating ? 'Creating...' : '✅ Create Task'}
                  </button>

                  {students.length === 0 && (
                    <p style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      ⚠️ No students registered yet. Ask students to register first.
                    </p>
                  )}
                </div>

                {/* All Tasks Table */}
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Created</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.length === 0 ? (
                        <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No tasks yet</td></tr>
                      ) : tasks.map((t, i) => (
                        <tr key={t._id}>
                          <td>{i + 1}</td>
                          <td><strong>{t.title}</strong>{t.description && <span className="task-meta" style={{ display: 'block' }}>{t.description}</span>}</td>
                          <td>{t.assignedTo?.email || '—'}</td>
                          <td><span className={`badge badge-${t.status}`}>{t.status}</span></td>
                          <td style={{ color: t.deadline ? 'var(--text)' : 'var(--text-muted)' }}>
                            {formatDate(t.deadline)}
                          </td>
                          <td>{formatDate(t.createdAt)}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteTask(t._id, t.title)}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
