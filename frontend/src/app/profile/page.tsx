'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

const ProfileContent: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    maxDistance: user?.preferences?.maxDistance || 10,
    notifications: user?.preferences?.notifications ?? true,
    cuisineTypes: user?.preferences?.cuisineTypes || [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const cuisineOptions = [
    'American', 'Italian', 'Mexican', 'Chinese', 'Indian', 
    'Japanese', 'Thai', 'Mediterranean', 'French', 'Korean'
  ];

  const handleCuisineToggle = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          preferences: {
            maxDistance: formData.maxDistance,
            notifications: formData.notifications,
            cuisineTypes: formData.cuisineTypes,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch {
      setMessage('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-2xl border-2 border-surf-ocean">
            <h1 className="text-4xl md:text-5xl font-bold text-surf-deepBlue mb-4">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-surf-coral to-surf-sunset">Profile</span>
            </h1>
            <p className="text-xl text-surf-driftwood">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-8 mb-8 border-2 border-surf-ocean shadow-2xl">
          {/* User Info Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-surf-sand">
            <div className="flex items-center space-x-4">
              <div className="bg-surf-coral text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-surf-deepBlue">{user.name}</h2>
                <p className="text-surf-driftwood">{user.email}</p>
                <span className="inline-block bg-surf-teal text-white text-sm px-3 py-1 rounded-full font-semibold mt-1">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) {
                  setFormData({
                    name: user.name,
                    maxDistance: user.preferences?.maxDistance || 10,
                    notifications: user.preferences?.notifications || true,
                    cuisineTypes: user.preferences?.cuisineTypes || [],
                  });
                }
              }}
              className="bg-surf-ocean text-white px-6 py-2 rounded-lg font-semibold hover:bg-surf-wave transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-500 bg-opacity-20 border border-green-500 text-green-700' 
                : 'bg-red-500 bg-opacity-20 border border-red-500 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-surf-deepBlue text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-surf-sand bg-opacity-30 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all"
                  required
                />
              </div>

              {/* Max Distance */}
              <div>
                <label className="block text-surf-deepBlue text-sm font-bold mb-2">
                  Maximum Distance for Deals (km)
                </label>
                <select
                  value={formData.maxDistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                  className="w-full bg-surf-sand bg-opacity-30 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                </select>
              </div>

              {/* Notifications */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                    className="w-5 h-5 text-surf-coral focus:ring-surf-coral border-2 border-surf-wave rounded"
                  />
                  <span className="text-surf-deepBlue font-medium">
                    Receive notifications about new deals
                  </span>
                </label>
              </div>

              {/* Cuisine Preferences */}
              <div>
                <label className="block text-surf-deepBlue text-sm font-bold mb-3">
                  Preferred Cuisines
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {cuisineOptions.map((cuisine) => (
                    <label key={cuisine} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.cuisineTypes.includes(cuisine)}
                        onChange={() => handleCuisineToggle(cuisine)}
                        className="w-4 h-4 text-surf-coral focus:ring-surf-coral border-2 border-surf-wave rounded"
                      />
                      <span className="text-surf-deepBlue text-sm">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-surf-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-surf-sunset transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-surf-driftwood text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Display Current Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surf-sand bg-opacity-30 rounded-lg p-4">
                  <h3 className="text-surf-deepBlue font-semibold mb-2">Deal Radius</h3>
                  <p className="text-surf-driftwood">{user.preferences?.maxDistance || 10} km</p>
                </div>
                <div className="bg-surf-sand bg-opacity-30 rounded-lg p-4">
                  <h3 className="text-surf-deepBlue font-semibold mb-2">Notifications</h3>
                  <p className="text-surf-driftwood">
                    {user.preferences?.notifications ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              {user.preferences?.cuisineTypes && user.preferences.cuisineTypes.length > 0 && (
                <div className="bg-surf-sand bg-opacity-30 rounded-lg p-4">
                  <h3 className="text-surf-deepBlue font-semibold mb-3">Preferred Cuisines</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.cuisineTypes.map((cuisine) => (
                      <span
                        key={cuisine}
                        className="bg-surf-teal text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};