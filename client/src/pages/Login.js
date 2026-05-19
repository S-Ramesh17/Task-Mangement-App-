// pages/Login.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState(''); // ✅ NEW
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        // ✅ REGISTER (student only)
        const data = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password
        });

        if (data.user) {
          setSuccess('Account created! Please login.');
          setIsRegister(false);
          setPassword('');
          setName('');
        } else {
          setError(data.message || 'Registration failed');
        }

      } else {
        // ✅ LOGIN
        const data = await loginUser({
          email: email.trim(),
          password
        });

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));

          // Redirect based on role
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }

        } else {
          setError(data.message || 'Invalid credentials');
        }
      }

    } catch {
      setError('Cannot connect to server. Is it running?');
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">📋</div>
        <h1 className="auth-title">TaskManager</h1>

        <p className="auth-subtitle">
          {isRegister ? 'Create your student account' : 'Sign in to your account'}
        </p>

        {/* Demo accounts */}
        {!isRegister && (
          <div className="auth-hint">
            <strong>Demo Accounts</strong><br />
            Admin: admin@test.com / 1234<br />
            Student: user@test.com / 1234
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* ✅ NAME FIELD (ONLY REGISTER) */}
        {isRegister && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus={!isRegister}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {isRegister && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
            ℹ️ New accounts are created as <strong>Student</strong> only.
          </p>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
        </button>

        <p className="auth-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>

      </div>
    </div>
  );
}