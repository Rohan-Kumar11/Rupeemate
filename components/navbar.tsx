'use client'

import React, { useState, useEffect } from 'react';
import { Wallet, User, ChevronDown, LogOut, Settings, CreditCard, PiggyBank, TrendingUp, Calculator, DollarSign, Sparkles, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import AuthModal from './AuthModal';
import ForgotPasswordModal from './ForgotPasswordModal';

// ── Ledger palette (matches Tax Center / Manager) ──
const INK = '#1B2B44';
const INK_DEEP = '#152238';
const PAPER = '#FCFAF4';
const LINE = '#D9D0B8';
const AMBER = '#B8860B';
const TEAL = '#3F6B4D';
const ROSE = '#A6432D';

const calculators = [
  {
    id: 'mutual-funds',
    name: 'Mutual Funds',
    description: 'Calculate SIP returns',
    icon: TrendingUp,
    href: '/calculators/MutualFunds',
    color: 'from-[#3F6B4D] to-[#5C7A5C]'
  },
  {
    id: 'sip',
    name: 'SIP Calculator',
    description: 'Plan your investments',
    icon: PiggyBank,
    href: '/calculators/sip',
    color: 'from-[#B8860B] to-[#D9A62B]'
  },
  {
    id: 'swp',
    name: 'SWP Calculator',
    description: 'Systematic withdrawal',
    icon: DollarSign,
    href: '/calculators/SWP',
    color: 'from-[#A6432D] to-[#C77D22]'
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
      <nav
        className="fixed top-0 left-0 right-0 z-50 shadow-lg"
        style={{ background: `linear-gradient(to right, ${INK_DEEP}, ${INK}, ${INK_DEEP})`, borderBottom: `1px solid ${AMBER}33` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="p-2 rounded-md" style={{ backgroundColor: PAPER }}>
                <Wallet className="w-6 h-6" style={{ color: INK }} />
              </div>
              <span className="font-serif text-2xl font-bold" style={{ color: PAPER }}>
                RupeeMate
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <div 
                className="relative"
                onMouseEnter={() => setShowCalculatorDropdown(true)}
                onMouseLeave={() => setShowCalculatorDropdown(false)}
              >
                <button className="transition-colors flex items-center space-x-1 group py-2" style={{ color: LINE }}>
                  <Calculator className="w-4 h-4" />
                  <span className="group-hover:text-[#D9A62B]">Features</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showCalculatorDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCalculatorDropdown && (
                  <div className="absolute top-full left-0 pt-2 animate-fadeIn">
                    <div className="rounded-md shadow-2xl p-4 w-[520px]" style={{ backgroundColor: INK_DEEP, border: `1px solid ${AMBER}4D` }}>
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
                              className="group relative overflow-hidden rounded-md p-4 transition-all duration-300 hover:-translate-y-0.5"
                              style={{
                                backgroundColor: `${PAPER}0F`,
                                border: `1px solid ${LINE}33`,
                                animationDelay: `${index * 50}ms`
                              }}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${calc.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}></div>
                              
                              <div className="relative">
                                <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${calc.color} p-2 mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                  <Icon className="w-full h-full text-white" />
                                </div>
                                
                                <h3 className="font-semibold text-xs mb-0.5 transition-colors" style={{ color: PAPER }}>
                                  {calc.name}
                                </h3>
                                
                                <p className="text-[10px] leading-snug" style={{ color: LINE }}>
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
                className="relative group transition-colors flex items-center space-x-2"
                style={{ color: LINE }}
              >
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                <span className="group-hover:text-[#D9A62B]">AI-planner</span>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ backgroundColor: AMBER }}></div>
              </button>

              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="relative group transition-colors"
                  style={{ color: LINE }}
                >
                  <span className="group-hover:text-[#D9A62B]">{link.label}</span>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ backgroundColor: AMBER }}></div>
                </button>
              ))}
            </div>

            {/* Desktop right-side actions */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={() => openModal(true)}
                    className="transition-colors font-medium hover:text-[#D9A62B]"
                    style={{ color: LINE }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openModal(false)}
                    className="px-6 py-2 rounded-md font-medium transition-all duration-300 hover:opacity-90"
                    style={{ backgroundColor: PAPER, color: INK }}
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md transition-all"
                    style={{ backgroundColor: `${PAPER}1A`, border: `1px solid ${AMBER}4D` }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: PAPER }}>
                      <User className="w-5 h-5" style={{ color: INK }} />
                    </div>
                    <span className="font-medium" style={{ color: PAPER }}>{user.email?.split('@')[0]}</span>
                    <ChevronDown className="w-4 h-4" style={{ color: LINE }} />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-xl overflow-hidden z-50 animate-slideDown" style={{ backgroundColor: INK_DEEP, border: `1px solid ${LINE}33` }}>
                      <div className="px-4 py-3" style={{ backgroundColor: `${AMBER}14`, borderBottom: `1px solid ${LINE}33` }}>
                        <p className="text-sm" style={{ color: LINE }}>Signed in as</p>
                        <p className="text-sm font-medium truncate" style={{ color: PAPER }}>{user.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                          router.push('/profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors hover:bg-[#22334F]"
                        style={{ color: LINE }}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/savings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors hover:bg-[#22334F]"
                        style={{ color: LINE }}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>My Savings</span>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors hover:bg-[#22334F]"
                        style={{ color: LINE }}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors hover:bg-[#22334F]"
                        style={{ color: ROSE, borderTop: `1px solid ${LINE}33` }}
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: PAPER }}>
                  <User className="w-4 h-4" style={{ color: INK }} />
                </div>
              )}
              <button
                onClick={() => setShowMobileMenu(true)}
                aria-label="Open menu"
                aria-expanded={showMobileMenu}
                className="relative w-10 h-10 rounded-md flex items-center justify-center active:scale-90 transition-transform"
                style={{ backgroundColor: `${AMBER}26`, border: `1px solid ${AMBER}4D` }}
              >
                <Menu className="w-5 h-5" style={{ color: AMBER }} />
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
          className={`absolute top-0 right-0 h-full w-[84%] max-w-sm shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            showMobileMenu ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ backgroundColor: INK, borderLeft: `1px solid ${AMBER}33` }}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16" style={{ borderBottom: `1px solid ${LINE}26`, background: `linear-gradient(to right, ${INK_DEEP}, ${INK})` }}>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md" style={{ backgroundColor: PAPER }}>
                <Wallet className="w-5 h-5" style={{ color: INK }} />
              </div>
              <span className="font-serif text-lg font-bold" style={{ color: PAPER }}>
                RupeeMate
              </span>
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
              className="w-9 h-9 rounded-md flex items-center justify-center active:scale-90 transition-transform"
              style={{ backgroundColor: INK_DEEP, border: `1px solid ${LINE}33` }}
            >
              <X className="w-5 h-5" style={{ color: LINE }} />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
            {user && (
              <div className="mb-4 px-4 py-3 rounded-md" style={{ backgroundColor: `${AMBER}14`, border: `1px solid ${AMBER}33` }}>
                <p className="text-xs" style={{ color: LINE }}>Signed in as</p>
                <p className="text-sm font-medium truncate" style={{ color: PAPER }}>{user.email}</p>
              </div>
            )}

            {/* Features accordion */}
            <button
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              className="w-full flex items-center justify-between py-3.5 px-1 font-medium"
              style={{ color: PAPER, borderBottom: `1px solid ${LINE}26` }}
            >
              <span className="flex items-center space-x-3">
                <Calculator className="w-4 h-4" style={{ color: AMBER }} />
                <span>Features</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileFeaturesOpen ? 'rotate-180' : ''}`} style={{ color: LINE }} />
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
                        className="w-full flex items-center space-x-3 p-3 rounded-md transition-colors"
                        style={{ backgroundColor: `${PAPER}0F`, border: `1px solid ${LINE}26` }}
                      >
                        <div className={`w-9 h-9 shrink-0 rounded-md bg-gradient-to-br ${calc.color} p-2`}>
                          <Icon className="w-full h-full text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold" style={{ color: PAPER }}>{calc.name}</p>
                          <p className="text-xs" style={{ color: LINE }}>{calc.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => goTo('/ai-planner')}
              className="w-full flex items-center space-x-3 py-3.5 px-1 font-medium"
              style={{ color: PAPER, borderBottom: `1px solid ${LINE}26` }}
            >
              <Sparkles className="w-4 h-4" style={{ color: AMBER }} />
              <span>AI-planner</span>
            </button>

            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => goTo(link.href)}
                className="w-full text-left py-3.5 px-1 font-medium"
                style={{ color: PAPER, borderBottom: `1px solid ${LINE}26` }}
              >
                {link.label}
              </button>
            ))}

            {user && (
              <>
                <button
                  onClick={() => goTo('/profile')}
                  className="w-full flex items-center space-x-3 py-3.5 px-1"
                  style={{ color: LINE, borderBottom: `1px solid ${LINE}26` }}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => goTo('/savings')}
                  className="w-full flex items-center space-x-3 py-3.5 px-1"
                  style={{ color: LINE, borderBottom: `1px solid ${LINE}26` }}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>My Savings</span>
                </button>
                <button
                  onClick={() => goTo('/settings')}
                  className="w-full flex items-center space-x-3 py-3.5 px-1"
                  style={{ color: LINE, borderBottom: `1px solid ${LINE}26` }}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </>
            )}
          </div>

          {/* Drawer footer actions */}
          <div className="px-5 py-5" style={{ borderTop: `1px solid ${LINE}26` }}>
            {!user ? (
              <div className="space-y-2">
                <button
                  onClick={() => openModal(false)}
                  className="w-full px-6 py-3 rounded-md font-medium active:scale-[0.98] transition-transform"
                  style={{ backgroundColor: PAPER, color: INK }}
                >
                  Get Started
                </button>
                <button
                  onClick={() => openModal(true)}
                  className="w-full px-6 py-3 rounded-md font-medium"
                  style={{ color: LINE, border: `1px solid ${LINE}4D` }}
                >
                  Sign In
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-md font-medium active:scale-[0.98] transition-transform"
                style={{ color: ROSE, border: `1px solid ${ROSE}33`, backgroundColor: `${ROSE}0D` }}
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