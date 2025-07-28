'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  requiredRole 
}) => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white bg-opacity-90 rounded-xl p-8 shadow-xl text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-surf-coral mx-auto mb-4"></div>
          <p className="text-surf-deepBlue font-bold text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white bg-opacity-90 rounded-xl p-8 shadow-xl text-center max-w-md">
              <h2 className="text-2xl font-bold text-surf-deepBlue mb-4">
                Authentication Required
              </h2>
              <p className="text-surf-driftwood mb-6">
                Please sign in to access this page.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-surf-coral text-white px-6 py-3 rounded-lg font-semibold hover:bg-surf-sunset transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-90 rounded-xl p-8 shadow-xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-surf-deepBlue mb-4">
            Access Denied
          </h2>
          <p className="text-surf-driftwood mb-4">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-surf-driftwood">
            Required role: <span className="font-semibold">{requiredRole}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};