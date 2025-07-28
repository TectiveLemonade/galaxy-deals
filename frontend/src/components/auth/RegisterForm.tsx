'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterFormProps {
  onToggleForm: () => void;
  onClose?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(name, email, password);
      onClose?.();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-2xl border-2 border-surf-ocean max-w-md w-full mx-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-surf-deepBlue mb-2">Join Wave Deals!</h2>
        <p className="text-surf-driftwood">Create your account to discover amazing deals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-surf-deepBlue text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surf-sand bg-opacity-30 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue placeholder-surf-driftwood focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-surf-deepBlue text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surf-sand bg-opacity-30 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue placeholder-surf-driftwood focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-surf-deepBlue text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surf-sand bg-opacity-30 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue placeholder-surf-driftwood focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all"
            placeholder="Create a password (min 6 characters)"
            required
          />
        </div>

        <div>
          <label className="block text-surf-deepBlue text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-surf-sand bg-opacity-30 border-2 border-surf-wave rounded-lg px-4 py-3 text-surf-deepBlue placeholder-surf-driftwood focus:border-surf-coral focus:outline-none focus:ring-2 focus:ring-surf-coral focus:ring-opacity-50 transition-all"
            placeholder="Confirm your password"
            required
          />
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-surf-teal to-surf-ocean text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-surf-driftwood">
          Already have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-surf-coral font-bold hover:text-surf-sunset transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};