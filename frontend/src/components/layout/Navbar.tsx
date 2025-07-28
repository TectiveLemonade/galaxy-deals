'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-galaxy-charcoal bg-opacity-95 backdrop-blur-sm border-b-2 border-galaxy-purple shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-galaxy-white">
                🌌 Daily <span className="text-galaxy-yellow">Deals</span>
              </h1>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-galaxy-silver hover:text-galaxy-yellow transition-colors font-medium"
              >
                🏠 Home
              </Link>
              <Link 
                href="/restaurants" 
                className="text-galaxy-silver hover:text-galaxy-yellow transition-colors font-medium"
              >
                🍽️ Restaurants
              </Link>
              {user && (
                <Link 
                  href="/deals" 
                  className="text-galaxy-silver hover:text-galaxy-yellow transition-colors font-medium"
                >
                  ⭐ My Deals
                </Link>
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="bg-galaxy-purple text-galaxy-white px-4 py-2 rounded-lg font-semibold hover:bg-galaxy-accent transition-colors flex items-center space-x-2"
                  >
                    <span>👋 {user.name}</span>
                    <span className="text-sm">▼</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-galaxy-charcoal rounded-lg shadow-xl border-2 border-galaxy-purple z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-galaxy-purple">
                          <p className="text-sm text-galaxy-silver">Signed in as</p>
                          <p className="text-galaxy-white font-semibold">{user.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-galaxy-white hover:bg-galaxy-purple hover:bg-opacity-30 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-galaxy-silver hover:text-galaxy-white transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="bg-gradient-to-r from-galaxy-purple to-galaxy-blue text-white px-4 py-2 rounded-lg font-semibold hover:from-galaxy-accent hover:to-galaxy-skyBlue transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu - Simple version */}
        <div className="md:hidden bg-galaxy-charcoal bg-opacity-90 border-t border-galaxy-purple">
          <div className="px-4 py-3 space-y-2">
            <Link 
              href="/" 
              className="block text-galaxy-silver hover:text-galaxy-white transition-colors font-medium py-1"
            >
              Home
            </Link>
            <Link 
              href="/restaurants" 
              className="block text-galaxy-silver hover:text-galaxy-white transition-colors font-medium py-1"
            >
              Restaurants
            </Link>
            {user && (
              <Link 
                href="/deals" 
                className="block text-galaxy-silver hover:text-galaxy-white transition-colors font-medium py-1"
              >
                My Deals
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Close user menu when clicking outside */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};