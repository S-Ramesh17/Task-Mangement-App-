// components/ProtectedRoute.js - Redirects to login if not authenticated

import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Admin-only route accessed by student → redirect to dashboard
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
