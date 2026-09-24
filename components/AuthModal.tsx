'use client'

import React, { useState } from 'react';
import { X, Mail, Lock, User, TrendingUp, Shield, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  showAuthModal: boolean;
  isSignIn: boolean;
  onClose: () => void;
  onToggleMode: () => void;
  onSuccess: () => void;
  onForgotPassword: () => void;
}

// ── Ledger palette (matches Tax Center / Manager) ──
const INK = '#1B2B44';
const PAPER = '#FCFAF4';
const CANVAS = '#F7F3E9';
const LINE = '#D9D0B8';
const AMBER = '#B8860B';
const TEAL = '#3F6B4D';
const ROSE = '#A6432D';
const MUTED = '#8A8371';

const AuthModal: React.FC<AuthModalProps> = ({
  showAuthModal,
  isSignIn,
  onClose,
  onToggleMode,
  onSuccess,
  onForgotPassword,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const resetForm = () => {
    setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSignUp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (existingUser.user) {
        setError('An account with this email already exists. Please sign in instead.');
        setLoading(false);
        return;
      }
    } catch (err) {
      // User doesn't exist, proceed with signup
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      setLoading(false);

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.');
        } else if (signUpError.message.includes('invalid')) {
          setError('Invalid email or password format');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data.user) {
        console.log('User created:', data.user.email);
        
        if (data.user.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please sign in instead.');
          return;
        }
        
        if (data.session) {
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            resetForm();
            onSuccess();
          }, 1500);
        } else {
          setSuccess('Account created! Please check your email to verify your account before signing in.');
          setTimeout(() => {
            onToggleMode();
            setSuccess('');
            resetForm();
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setLoading(false);
      setError(err.message || 'An error occurred during sign up');
    }
  };

  const handleSignIn = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email.trim()) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      setLoading(false);

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email before signing in. Check your inbox for the verification link.');
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (signInError.message.includes('Email link is invalid')) {
          setError('Verification link expired. Please request a new one.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user && data.session) {
        console.log('User signed in:', data.user.email);
        setSuccess('Signed in successfully! Redirecting...');
        
        setTimeout(() => {
          resetForm();
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setLoading(false);
      setError(err.message || 'An error occurred during sign in');
    }
  };

  const handleSubmit = () => {
    if (isSignIn) {
      handleSignIn();
    } else {
      handleSignUp();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleToggleMode = () => {
    resetForm();
    onToggleMode();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div className="rounded-md shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-slideUp" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>
        <div className="relative p-8" style={{ background: `linear-gradient(to bottom right, ${CANVAS}, ${PAPER})`, borderBottom: `1px solid ${LINE}` }}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 transition-colors p-1 rounded-md hover:bg-[#EFE9D8]"
            style={{ color: MUTED }}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-md shadow-lg" style={{ backgroundColor: INK }}>
              <Shield className="w-8 h-8" style={{ color: PAPER }} />
            </div>
          </div>
          
          <h2 className="font-serif text-3xl text-center mb-2" style={{ color: INK }}>
            {isSignIn ? 'Welcome Back!' : 'Join RupeeMate'}
          </h2>
          <p className="text-center text-sm" style={{ color: MUTED }}>
            {isSignIn ? 'Sign in to continue your financial journey' : 'Create your account and start saving today'}
          </p>
        </div>

        <div className="p-8 space-y-5">
          {error && (
            <div className="px-4 py-3 rounded-md text-sm flex items-center space-x-2 animate-shake" style={{ backgroundColor: '#F3E2DC', border: `1px solid #E0BDB0`, color: ROSE }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ROSE }}></div>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="px-4 py-3 rounded-md text-sm flex items-center space-x-2" style={{ backgroundColor: '#E4EDE6', border: `1px solid #C3D8C8`, color: TEAL }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TEAL }}></div>
              <span>{success}</span>
            </div>
          )}

          {!isSignIn && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: INK }}>Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: MUTED }} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-md pl-12 pr-4 py-3.5 focus:outline-none transition-all"
                  style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }}
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: INK }}>Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: MUTED }} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full rounded-md pl-12 pr-4 py-3.5 focus:outline-none transition-all"
                style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: INK }}>Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: MUTED }} />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full rounded-md pl-12 pr-12 py-3.5 focus:outline-none transition-all"
                style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors hover:text-[#B8860B]"
                style={{ color: MUTED }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isSignIn && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: INK }}>Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: MUTED }} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-md pl-12 pr-12 py-3.5 focus:outline-none transition-all"
                  style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors hover:text-[#B8860B]"
                  style={{ color: MUTED }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {isSignIn && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm transition-colors font-medium hover:opacity-80"
                style={{ color: AMBER }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 rounded-md font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6 hover:opacity-90"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: PAPER, borderTopColor: 'transparent' }} />
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span>{isSignIn ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={handleToggleMode}
              className="transition-colors text-sm"
              style={{ color: MUTED }}
            >
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
              <span className="font-semibold" style={{ color: AMBER }}>
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </span>
            </button>
          </div>
        </div>

        <div className="px-8 py-6" style={{ backgroundColor: CANVAS, borderTop: `1px solid ${LINE}` }}>
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-2xl font-bold" style={{ color: TEAL }}>50K+</p>
              <p className="text-xs" style={{ color: MUTED }}>Active Users</p>
            </div>
            <div className="h-10 w-px" style={{ backgroundColor: LINE }}></div>
            <div>
              <p className="text-2xl font-bold" style={{ color: TEAL }}>$2M+</p>
              <p className="text-xs" style={{ color: MUTED }}>Saved</p>
            </div>
            <div className="h-10 w-px" style={{ backgroundColor: LINE }}></div>
            <div>
              <p className="text-2xl font-bold" style={{ color: TEAL }}>4.9★</p>
              <p className="text-xs" style={{ color: MUTED }}>Rating</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;