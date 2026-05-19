// components/Navbar.js - Top navigation bar with role-aware links

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-brand">📋 TaskManager</div>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>
          Dashboard
        </Link>
        <Link to="/tasks" className={isActive('/tasks')} onClick={() => setMenuOpen(false)}>
          My Tasks
        </Link>
        {user.role === 'admin' && (
          <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>
            Admin Panel
          </Link>
        )}
      </div>

      <div className="navbar-right">
        <span className="navbar-email">{user.email}</span>
        <span className={`badge badge-${user.role}`}>{user.role}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}
