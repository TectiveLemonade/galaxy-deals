'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onToggleForm: () => void;
  onClose?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      onClose?.();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-2xl border-2 border-surf-ocean max-w-md w-full mx-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-surf-deepBlue mb-2">Welcome Back!</h2>
        <p className="text-surf-driftwood">Sign in to your Wave Deals account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Enter your password"
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
          className="w-full bg-gradient-to-r from-surf-coral to-surf-sunset text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-surf-driftwood">
          Don&apos;t have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-surf-coral font-bold hover:text-surf-sunset transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};