// services/api.js - All API calls to backend (No JWT)

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Get stored user from localStorage
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

// Build headers — sends user info as X-User header instead of JWT token
const authHeaders = () => {
  const user = getUser();
  return {
    'Content-Type': 'application/json',
    'X-User': user ? JSON.stringify(user) : ''
  };
};

// ─── AUTH ──────────────────────────────────────

export const registerUser = async (data) => {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

// ─── TASKS ─────────────────────────────────────

export const getTasks = async () => {
  const res = await fetch(`${BASE}/api/tasks`, {
    headers: authHeaders()
  });
  return res.json();
};

export const createTask = async (data) => {
  const res = await fetch(`${BASE}/api/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return res.json();
};

// ─── ADMIN ─────────────────────────────────────

export const getAdminUsers = async () => {
  const res = await fetch(`${BASE}/api/admin/users`, {
    headers: authHeaders()
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${BASE}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return res.json();
};

export const getAdminStats = async () => {
  const res = await fetch(`${BASE}/api/admin/stats`, {
    headers: authHeaders()
  });
  return res.json();
};
