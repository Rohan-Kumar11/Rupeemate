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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full border border-emerald-500/30 overflow-hidden transform transition-all animate-slideUp">
        <div className="relative bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-slate-900 p-8 border-b border-emerald-500/30">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-3 rounded-2xl shadow-lg">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            {forgotPasswordStep === 'email' && 'Reset Password'}
            {forgotPasswordStep === 'otp' && 'Verify OTP'}
            {forgotPasswordStep === 'newPassword' && 'New Password'}
          </h2>
          <p className="text-slate-400 text-center text-sm">
            {forgotPasswordStep === 'email' && 'Enter your email to receive a reset code'}
            {forgotPasswordStep === 'otp' && 'Enter the 6-digit code sent to your email'}
            {forgotPasswordStep === 'newPassword' && 'Create a new strong password'}
          </p>
        </div>

        <div className="p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center space-x-2 animate-shake">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>{success}</span>
            </div>
          )}

          {forgotPasswordStep === 'email' && (
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="email"
                  value={forgotPasswordData.email}
                  onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                  onKeyPress={handleForgotPasswordKeyPress}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          )}

          {forgotPasswordStep === 'otp' && (
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">Enter OTP</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  maxLength={6}
                  value={forgotPasswordData.otp}
                  onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, otp: e.target.value.replace(/\D/g, '') })}
                  onKeyPress={handleForgotPasswordKeyPress}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
              <p className="text-slate-500 text-xs mt-2 text-center">Check your email for the 6-digit code</p>
            </div>
          )}

          {forgotPasswordStep === 'newPassword' && (
            <>
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={forgotPasswordData.newPassword}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, newPassword: e.target.value })}
                    onKeyPress={handleForgotPasswordKeyPress}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">Confirm New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={forgotPasswordData.confirmNewPassword}
                    onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, confirmNewPassword: e.target.value })}
                    onKeyPress={handleForgotPasswordKeyPress}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
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
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Remember your password? <span className="font-semibold text-emerald-400">Sign In</span>
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
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Didn't receive the code? <span className="font-semibold text-emerald-400">Resend</span>
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