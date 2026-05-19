// pages/Profile.js - Shows logged-in user info from backend (upgraded from original)

import { useEffect, useState } from 'react';
import { getProfile } from '../services/api';
import Navbar from '../components/Navbar';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch fresh profile data from backend
    getProfile().then((data) => {
      if (data._id) setProfile(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h2>My Profile</h2>
        </div>

        {loading ? (
          <div className="loading">Loading profile...</div>
        ) : !profile ? (
          <div className="alert alert-error">Could not load profile.</div>
        ) : (
          <div className="profile-card">
            <div className="profile-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <div className="profile-row">
                <span className="profile-label">Name</span>
                <span className="profile-value">{profile.name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{profile.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Role</span>
                <span className={`role-badge ${profile.role}`}>{profile.role}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Member Since</span>
                <span className="profile-value">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
