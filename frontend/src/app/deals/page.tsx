'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function DealsPage() {
  return (
    <ProtectedRoute>
      <DealsContent />
    </ProtectedRoute>
  );
}

const DealsContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-2xl border-2 border-surf-ocean">
            <h1 className="text-4xl md:text-5xl font-bold text-surf-deepBlue mb-4">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-surf-coral to-surf-sunset">Deals</span>
            </h1>
            <p className="text-xl text-surf-driftwood">
              Welcome back, {user?.name}! Here are your personalized deals.
            </p>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-12 border-2 border-surf-ocean shadow-2xl text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-3xl font-bold text-surf-deepBlue mb-4">
              Feature Coming Soon!
            </h2>
            <p className="text-surf-driftwood text-lg mb-6">
              We&apos;re working hard to bring you personalized deal tracking, favorites, and redemption history. 
              This feature will be available in the next update.
            </p>
            <div className="bg-surf-sand bg-opacity-30 rounded-lg p-6">
              <h3 className="text-surf-deepBlue font-semibold mb-3">What&apos;s Coming:</h3>
              <ul className="text-left text-surf-driftwood space-y-2">
                <li>📋 Track deals you&apos;ve viewed and saved</li>
                <li>❤️ Favorite deals for quick access</li>
                <li>📊 Your deal redemption history</li>
                <li>🔔 Notifications for deals matching your preferences</li>
                <li>🎯 Personalized recommendations based on your location</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};