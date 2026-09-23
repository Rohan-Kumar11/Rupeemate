'use client'

import React, { useState, useEffect } from 'react';
import { Wallet, User, ChevronDown, LogOut, Settings, CreditCard, PiggyBank, TrendingUp, Calculator, DollarSign, Sparkles, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import AuthModal from './AuthModal';
import ForgotPasswordModal from './ForgotPasswordModal';

const calculators = [
  {
    id: 'mutual-funds',
    name: 'Mutual Funds',
    description: 'Calculate SIP returns',
    icon: TrendingUp,
    href: '/calculators/MutualFunds',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'sip',
    name: 'SIP Calculator',
    description: 'Plan your investments',
    icon: PiggyBank,
    href: '/calculators/sip',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'swp',
    name: 'SWP Calculator',
    description: 'Systematic withdrawal',
    icon: DollarSign,
    href: '/calculators/SWP',
    color: 'from-purple-500 to-pink-500'
  }
];

const navLinks = [
  { label: 'Hub', href: '/hub' },
  { label: 'Manager', href: '/manager' },
  { label: 'Goals', href: '/goals' },
  { label: 'Tax', href: '/tax' },
];

const Navbar = () => {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCalculatorDropdown, setShowCalculatorDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (_event === 'SIGNED_IN' && session?.user) {
        await ensureProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await ensureProfile(session.user);
      }
    } catch (err) {
      console.error('Error checking user:', err);
    }
  };

  const ensureProfile = async (user: SupabaseUser) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: null,
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Profile created successfully');
        }
      }
    } catch (err) {
      console.error('Error ensuring profile:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        return;
      }
      
      setUser(null);
      setShowProfileMenu(false);
      setShowMobileMenu(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const openModal = (isSignInMode: boolean) => {
    setIsSignIn(isSignInMode);
    setShowAuthModal(true);
    setShowForgotPassword(false);
    setShowMobileMenu(false);
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setShowAuthModal(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    router.refresh();
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
    setShowAuthModal(true);
    setIsSignIn(true);
  };

  const goTo = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
    setMobileFeaturesOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                RupeeMate
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <div 
                className="relative"
                onMouseEnter={() => setShowCalculatorDropdown(true)}
                onMouseLeave={() => setShowCalculatorDropdown(false)}
              >
                <button className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-1 group py-2">
                  <Calculator className="w-4 h-4" />
                  <span>Features</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCalculatorDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCalculatorDropdown && (
                  <div className="absolute top-full left-0 pt-2 animate-fadeIn">
                    <div className="bg-slate-900/98 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl shadow-black/50 p-4 w-[520px]">
                      <div className="grid grid-cols-3 gap-3">
                        {calculators.map((calc, index) => {
                          const Icon = calc.icon;
                          return (
                            <button
                              key={calc.id}
                              onClick={() => {
                                router.push(calc.href);
                                setShowCalculatorDropdown(false);
                              }}
                              className="group relative overflow-hidden rounded-lg p-4 bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                              style={{
                                animationDelay: `${index * 50}ms`
                              }}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${calc.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                              
                              <div className="relative">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${calc.color} p-2 mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                  <Icon className="w-full h-full text-white" />
                                </div>
                                
                                <h3 className="text-white font-semibold text-xs mb-0.5 group-hover:text-emerald-400 transition-colors">
                                  {calc.name}
                                </h3>
                                
                                <p className="text-slate-400 text-[10px] leading-snug">
                                  {calc.description}
                                </p>
                              </div>

                              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${calc.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => router.push('/ai-planner')} 
                className="relative group text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                <span>AI-planner</span>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </button>

              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="relative group text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <span>{link.label}</span>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </button>
              ))}
            </div>

            {/* Desktop right-side actions */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={() => openModal(true)}
                    className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openModal(false)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 px-4 py-2 rounded-lg hover:border-emerald-500/50 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-200 font-medium">{user.email?.split('@')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 animate-slideDown">
                      <div className="px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-slate-700">
                        <p className="text-sm text-slate-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          router.push('/profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-3 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/savings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-3 transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>My Savings</span>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700 flex items-center space-x-3 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-700 flex items-center space-x-3 transition-colors border-t border-slate-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile: avatar (if signed in) + hamburger trigger */}
            <div className="flex md:hidden items-center space-x-3">
              {user && (
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <button
                onClick={() => setShowMobileMenu(true)}
                aria-label="Open menu"
                aria-expanded={showMobileMenu}
                className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Menu className="w-5 h-5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer + backdrop */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
          showMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowMobileMenu(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[84%] max-w-sm bg-slate-900 border-l border-emerald-500/20 shadow-2xl shadow-black/60 flex flex-col transition-transform duration-300 ease-out ${
            showMobileMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-1.5 rounded-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                RupeeMate
              </span>
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
              className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
            {user && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-medium text-white truncate">{user.email}</p>
              </div>
            )}

            {/* Features accordion */}
            <button
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              className="w-full flex items-center justify-between py-3.5 px-1 text-slate-200 font-medium border-b border-slate-800"
            >
              <span className="flex items-center space-x-3">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Features</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${mobileFeaturesOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                mobileFeaturesOpen ? 'grid-rows-[1fr] opacity-100 py-2' : 'grid-rows-[0fr] opacity-0'
              }`}
              style={{ display: 'grid' }}
            >
              <div className="overflow-hidden">
                <div className="space-y-2 pb-2">
                  {calculators.map((calc) => {
                    const Icon = calc.icon;
                    return (
                      <button
                        key={calc.id}
                        onClick={() => goTo(calc.href)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 active:border-emerald-500/60 transition-colors"
                      >
                        <div className={`w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br ${calc.color} p-2`}>
                          <Icon className="w-full h-full text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">{calc.name}</p>
                          <p className="text-xs text-slate-400">{calc.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => goTo('/ai-planner')}
              className="w-full flex items-center space-x-3 py-3.5 px-1 text-slate-200 font-medium border-b border-slate-800"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI-planner</span>
            </button>

            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => goTo(link.href)}
                className="w-full text-left py-3.5 px-1 text-slate-200 font-medium border-b border-slate-800"
              >
                {link.label}
              </button>
            ))}

            {user && (
              <>
                <button
                  onClick={() => goTo('/profile')}
                  className="w-full flex items-center space-x-3 py-3.5 px-1 text-slate-300 border-b border-slate-800"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => goTo('/savings')}
                  className="w-full flex items-center space-x-3 py-3.5 px-1 text-slate-300 border-b border-slate-800"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>My Savings</span>
                </button>
                <button
                  onClick={() => goTo('/settings')}
                  className="w-full flex items-center space-x-3 py-3.5 px-1 text-slate-300 border-b border-slate-800"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </>
            )}
          </div>

          {/* Drawer footer actions */}
          <div className="px-5 py-5 border-t border-slate-800">
            {!user ? (
              <div className="space-y-2">
                <button
                  onClick={() => openModal(false)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium active:scale-[0.98] transition-transform"
                >
                  Get Started
                </button>
                <button
                  onClick={() => openModal(true)}
                  className="w-full text-slate-300 px-6 py-3 rounded-lg font-medium border border-slate-700"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 text-red-400 px-6 py-3 rounded-lg font-medium border border-red-500/20 bg-red-500/5 active:scale-[0.98] transition-transform"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        showAuthModal={showAuthModal}
        isSignIn={isSignIn}
        onClose={() => setShowAuthModal(false)}
        onToggleMode={() => setIsSignIn(!isSignIn)}
        onSuccess={handleAuthSuccess}
        onForgotPassword={openForgotPassword}
      />

      <ForgotPasswordModal
        showForgotPassword={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={handleForgotPasswordSuccess}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
          }
          to { 
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;