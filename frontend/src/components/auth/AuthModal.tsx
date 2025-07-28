'use client';

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-surf-coral text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-surf-sunset transition-colors z-10"
        >
          ×
        </button>
        
        {mode === 'login' ? (
          <LoginForm onToggleForm={toggleMode} onClose={onClose} />
        ) : (
          <RegisterForm onToggleForm={toggleMode} onClose={onClose} />
        )}
      </div>
    </div>
  );
};