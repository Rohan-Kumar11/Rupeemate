'use client'

import React, { useState } from 'react';
import { X, Mail, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type ForgotPasswordStep = 'email' | 'otp' | 'newPassword';

interface ForgotPasswordModalProps {
  showForgotPassword: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  showForgotPassword,
  onClose,
  onSuccess,
}) => {
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const resetForgotPasswordForm = () => {
    setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmNewPassword: '' });
    setError('');
    setSuccess('');
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setForgotPasswordStep('email');
  };

  const handleForgotPasswordEmail = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!forgotPasswordData.email.trim()) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        forgotPasswordData.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      setLoading(false);

      if (resetError) {
        console.error('Password reset error:', resetError);
        setError(resetError.message);
        return;
      }

      setSuccess('Password reset OTP sent! Please check your email.');
      setForgotPasswordStep('otp');
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setLoading(false);
      setError(err.message || 'An error occurred');
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!forgotPasswordData.otp.trim()) {
      setError('Please enter the OTP');
      setLoading(false);
      return;
    }

    if (forgotPasswordData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: forgotPasswordData.email,
        token: forgotPasswordData.otp,
        type: 'recovery'
      });

      setLoading(false);

      if (verifyError) {
        console.error('OTP verification error:', verifyError);
        setError('Invalid or expired OTP. Please try again.');
        return;
      }

      setSuccess('OTP verified! Please set your new password.');
      setForgotPasswordStep('newPassword');
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setLoading(false);
      setError(err.message || 'An error occurred');
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (forgotPasswordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: forgotPasswordData.newPassword
      });

      setLoading(false);

      if (updateError) {
        console.error('Password update error:', updateError);
        setError(updateError.message);
        return;
      }

      setSuccess('Password updated successfully! You can now sign in.');
      setTimeout(() => {
        resetForgotPasswordForm();
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setLoading(false);
      setError(err.message || 'An error occurred');
    }
  };

  const handleForgotPasswordSubmit = () => {
    if (forgotPasswordStep === 'email') {
      handleForgotPasswordEmail();
    } else if (forgotPasswordStep === 'otp') {
      handleVerifyOTP();
    } else if (forgotPasswordStep === 'newPassword') {
      handleResetPassword();
    }
  };

  const handleForgotPasswordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleForgotPasswordSubmit();
    }
  };

  const handleClose = () => {
    resetForgotPasswordForm();
    onClose();
  };

  if (!showForgotPassword) return null;

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
              <KeyRound className="w-8 h-8" style={{ color: PAPER }} />
            </div>
          </div>
          
          <h2 className="font-serif text-3xl text-center mb-2" style={{ color: INK }}>
            {forgotPasswordStep === 'email' && 'Reset Password'}
            {forgotPasswordStep === 'otp' && 'Verify OTP'}
            {forgotPasswordStep === 'newPassword' && 'New Password'}
          </h2>
          <p className="text-center text-sm" style={{ color: MUTED }}>
            {forgotPasswordStep === 'email' && 'Enter your email to receive a reset code'}
            {forgotPasswordStep === 'otp' && 'Enter the 6-digit code sent to your email'}
            {forgotPasswordStep === 'newPassword' && 'Create a new strong password'}
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

          {forgotPasswordStep === 'email' && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: INK }}>Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: MUTED }} />
                <input
                  type="email"
                  value={forgotPasswordData.email}
                  onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                  onKeyPress={handleForgotPasswordKeyPress}
                  className="w-full rounded-md pl-12 pr-4 py-3.5 focus:outline-none transition-all"
                  style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }}
                  placeholder="you@example.com"
                />
              </div>
            </div>
          )}

          {forgotPasswordStep === 'otp' && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: INK }}>Enter OTP</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: MUTED }} />
                <input
                  type="text"
                  maxLength={6}
                  value={forgotPasswordData.otp}
                  onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, otp: e.target.value.replace(/\D/g, '') })}
                  onKeyPress={handleForgotPasswordKeyPress}
                  className="w-full rounded-md pl-12 pr-4 py-3.5 focus:outline-none transition-all text-center text-2xl tracking-widest"
                  style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }}
                  placeholder="000000"
                />
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: MUTED }}>Check your email for the 6-digit code</p>
            </div>
          )}

          {forgotPasswordStep === 'newPassword' && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: INK }}>New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: MUTED }} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={forgotPasswordData.newPassword}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value })}
                    onKeyPress={handleForgotPasswordKeyPress}
                    className="w-full rounded-md pl-12 pr-12 py-3.5 focus:outline-none transition-all"
                    style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors hover:text-[#B8860B]"
                    style={{ color: MUTED }}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: INK }}>Confirm New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: MUTED }} />
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={forgotPasswordData.confirmNewPassword}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, confirmNewPassword: e.target.value })}
                    onKeyPress={handleForgotPasswordKeyPress}
                    className="w-full rounded-md pl-12 pr-12 py-3.5 focus:outline-none transition-all"
                    style={{ backgroundColor: PAPER, border: `1px solid ${LINE}`, color: INK }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors hover:text-[#B8860B]"
                    style={{ color: MUTED }}
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            onClick={handleForgotPasswordSubmit}
            disabled={loading}
            className="w-full py-4 rounded-md font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6 hover:opacity-90"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: PAPER, borderTopColor: 'transparent' }} />
            ) : (
              <>
                <KeyRound className="w-5 h-5" />
                <span>
                  {forgotPasswordStep === 'email' && 'Send OTP'}
                  {forgotPasswordStep === 'otp' && 'Verify OTP'}
                  {forgotPasswordStep === 'newPassword' && 'Reset Password'}
                </span>
              </>
            )}
          </button>

          {forgotPasswordStep === 'email' && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={onSuccess}
                className="transition-colors text-sm"
                style={{ color: MUTED }}
              >
                Remember your password? <span className="font-semibold" style={{ color: AMBER }}>Sign In</span>
              </button>
            </div>
          )}

          {forgotPasswordStep === 'otp' && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordStep('email');
                  setError('');
                  setSuccess('');
                }}
                className="transition-colors text-sm"
                style={{ color: MUTED }}
              >
                Didn't receive the code? <span className="font-semibold" style={{ color: AMBER }}>Resend</span>
              </button>
            </div>
          )}
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

export default ForgotPasswordModal;