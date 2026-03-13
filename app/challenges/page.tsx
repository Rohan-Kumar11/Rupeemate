"use client"
import React, { useState } from 'react';
import { Trophy, Target, TrendingUp, Flame, Star, Award, Coins, Gift, CheckCircle, Circle, Lock, Zap, Crown, Shield, Rocket, Heart, Diamond, Sparkles, ThumbsUp, Medal, Users, Clock, Calendar, DollarSign, PiggyBank, Wallet, TrendingDown, Briefcase, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface Challenge {
  id: number;
  title: string;
  description: string;
  daysCompleted: number;
  totalDays: number;
  streak: number;
  coins: number;
  stars: number;
  gradient: string;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  color: string;
  bgColor: string;
  requirement: string;
}

const SavingsChallenges: React.FC = () => {
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const router = useRouter();
  const challenge: Challenge = {
    id: 1,
    title: '30-Day No-Spend Challenge',
    description: 'Cut unnecessary spending for 30 days and save big!',
    daysCompleted: 18,
    totalDays: 30,
    streak: 12,
    coins: 450,
    stars: 18,
    gradient: 'from-purple-500 via-pink-500 to-rose-500'
  };

  const badges: Badge[] = [
    { id: 1, name: 'First Steps', description: 'Complete your first day', icon: Target, unlocked: true, color: '#3b82f6', bgColor: '#dbeafe', requirement: '1 day' },
    { id: 2, name: 'Early Bird', description: 'Complete 3 consecutive days', icon: Flame, unlocked: true, color: '#f59e0b', bgColor: '#fef3c7', requirement: '3 days' },
    { id: 3, name: 'Week Warrior', description: 'Complete your first week', icon: Star, unlocked: true, color: '#8b5cf6', bgColor: '#ede9fe', requirement: '7 days' },
    { id: 4, name: 'Streak Master', description: 'Maintain a 10-day streak', icon: Zap, unlocked: true, color: '#eab308', bgColor: '#fef9c3', requirement: '10 days' },
    { id: 5, name: 'Halfway Hero', description: 'Reach the halfway point', icon: Trophy, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '15 days' },
    { id: 6, name: 'Persistence Pro', description: 'Complete 20 days', icon: Crown, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '20 days' },
    { id: 7, name: 'Diamond Saver', description: 'Save over $200', icon: Diamond, unlocked: true, color: '#06b6d4', bgColor: '#cffafe', requirement: '$200' },
    { id: 8, name: 'Shield Bearer', description: 'Resist temptation 5 times', icon: Shield, unlocked: true, color: '#10b981', bgColor: '#d1fae5', requirement: '5 resists' },
    { id: 9, name: 'Rocket Saver', description: 'Save 3x your goal in a day', icon: Rocket, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '3x goal' },
    { id: 10, name: 'Heart of Gold', description: 'Help a friend save', icon: Heart, unlocked: true, color: '#ec4899', bgColor: '#fce7f3', requirement: 'Refer 1' },
    { id: 11, name: 'Sparkle Star', description: 'Earn 500 coins', icon: Sparkles, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '500 coins' },
    { id: 12, name: 'Thumbs Up', description: 'Get 10 positive reviews', icon: ThumbsUp, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '10 reviews' },
    { id: 13, name: 'Medal Winner', description: 'Complete a challenge', icon: Medal, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '1 challenge' },
    { id: 14, name: 'Team Player', description: 'Join a savings group', icon: Users, unlocked: true, color: '#6366f1', bgColor: '#e0e7ff', requirement: 'Join group' },
    { id: 15, name: 'Time Master', description: 'Complete daily task on time', icon: Clock, unlocked: true, color: '#14b8a6', bgColor: '#ccfbf1', requirement: '5 on-time' },
    { id: 16, name: 'Calendar King', description: 'Track expenses for 30 days', icon: Calendar, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '30 days' },
    { id: 17, name: 'Money Mindful', description: 'Save $500 total', icon: DollarSign, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '$500' },
    { id: 18, name: 'Piggy Bank Pro', description: 'Fill piggy bank 5 times', icon: PiggyBank, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '5 fills' },
    { id: 19, name: 'Wallet Wizard', description: 'Reduce spending by 50%', icon: Wallet, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '50% cut' },
    { id: 20, name: 'Champion', description: 'Complete 30-day challenge', icon: Award, unlocked: false, color: '#94a3b8', bgColor: '#f1f5f9', requirement: '30 days' },
  ];

  const toggleDay = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter(d => d !== day));
    } else {
      setCompletedDays([...completedDays, day].sort((a, b) => a - b));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
  };

  const getDayStatus = (day: number): 'completed' | 'current' | 'upcoming' => {
    if (completedDays.includes(day)) return 'completed';
    if (day === completedDays.length + 1) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pt-24 pb-16 px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(168, 85, 247, 0); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 50px rgba(236, 72, 153, 0.6), 0 0 60px rgba(244, 114, 182, 0.5); }
        }

        .confetti {
          animation: confetti 1s ease-out forwards;
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .glow-animation {
          animation: glow 2s ease-in-out infinite;
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 float-animation">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Savings Challenges
            </h1>
          </div>
          <p className="text-base text-gray-600 font-medium ml-13">
            Track your progress and earn rewards!
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Challenge Card (2/3 width) */}
          <div className="lg:col-span-2">
            <div className={`relative bg-gradient-to-br ${challenge.gradient} rounded-2xl p-6 shadow-xl overflow-hidden glow-animation h-full`}>
              <div className="absolute inset-0 shimmer pointer-events-none"></div>
              
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="confetti absolute text-2xl"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: '50%',
                        animationDelay: `${Math.random() * 0.3}s`
                      }}
                    >
                      {['🎉', '⭐', '💰', '🏆', '✨', '💎'][Math.floor(Math.random() * 6)]}
                    </div>
                  ))}
                </div>
              )}

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-white flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 border border-white/30">
                        <Trophy className="w-3 h-3" />
                        Featured
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{challenge.title}</h2>
                    <p className="text-sm text-white/90">{challenge.description}</p>
                  </div>
                </div>

                {/* Compact Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <Target className="w-4 h-4 text-white mb-1" />
                    <p className="text-xl font-bold text-white">{challenge.daysCompleted}/{challenge.totalDays}</p>
                    <p className="text-xs text-white/80">Days</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <Flame className="w-4 h-4 text-white mb-1" />
                    <p className="text-xl font-bold text-white">{challenge.streak}</p>
                    <p className="text-xs text-white/80">Streak</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <Gift className="w-4 h-4 text-white mb-1" />
                    <p className="text-xl font-bold text-white">$285</p>
                    <p className="text-xs text-white/80">Saved</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <Star className="w-4 h-4 text-white mb-1" />
                    <p className="text-xl font-bold text-white">{Math.round((challenge.daysCompleted / challenge.totalDays) * 100)}%</p>
                    <p className="text-xs text-white/80">Complete</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-white/15 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/20">
                    <div 
                      className="h-3 bg-gradient-to-r from-white via-pink-100 to-purple-100 rounded-full transition-all duration-700 shadow-lg relative overflow-hidden"
                      style={{ width: `${(challenge.daysCompleted / challenge.totalDays) * 100}%` }}
                    >
                      <div className="absolute inset-0 shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* Daily Progress Grid - Compact */}
                <div className="grid grid-cols-10 gap-2 mb-4">
                  {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    const status = getDayStatus(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        disabled={day > completedDays.length + 1}
                        className={`
                          relative aspect-square rounded-lg font-bold text-xs transition-all duration-300
                          ${status === 'completed' ? 'bg-white text-purple-600 shadow-md hover:shadow-lg' : ''}
                          ${status === 'current' ? 'bg-white/40 text-white border border-white pulse-animation' : ''}
                          ${status === 'upcoming' ? 'bg-white/10 text-white/30 border border-white/10 cursor-not-allowed' : ''}
                          ${status !== 'upcoming' ? 'cursor-pointer hover:scale-110' : ''}
                        `}
                      >
                        {status === 'completed' && <CheckCircle className="absolute inset-0 m-auto w-3 h-3" />}
                        {status === 'current' && <Circle className="absolute inset-0 m-auto w-3 h-3" />}
                        {status === 'upcoming' && <Lock className="absolute inset-0 m-auto w-2.5 h-2.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Rewards & Action */}
                <div className="flex items-center justify-between bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-white">
                      <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                        <Coins className="w-4 h-4 text-yellow-900" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{challenge.coins}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-900" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{challenge.stars}</p>
                      </div>
                    </div>
                  </div>
                  <button className="bg-white text-purple-600 font-bold px-6 py-2 rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 text-sm">
                    Keep Going!
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats & Mini Badges */}
          <div className="space-y-4">
            {/* Quick Achievement Preview */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Recent Unlocks</h3>
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-2">
                {badges.filter(b => b.unlocked).slice(0, 4).map(badge => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: badge.bgColor }}>
                        <Icon className="w-5 h-5" style={{ color: badge.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{badge.name}</p>
                        <p className="text-xs text-emerald-600">✓ Unlocked</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => document.getElementById('badges-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full mt-3 text-purple-600 font-semibold text-sm py-2 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                View All Badges
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-5 shadow-lg text-white">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5" />
                <h3 className="text-lg font-bold">Your Rank</h3>
              </div>
              <div className="text-center py-4">
                <p className="text-5xl font-bold mb-1">#12</p>
                <p className="text-sm text-white/90">Out of 1,247 savers</p>
              </div>
              <button 
  onClick={() => router.push('/leaderboard')}
  className="w-full bg-white/20 backdrop-blur-md text-white font-semibold py-2 rounded-lg hover:bg-white/30 transition-colors border border-white/30 text-sm"
>
  View Leaderboard
</button>
            </div>
          </div>
        </div>

        {/* Achievement Badges Section */}
        <div id="badges-section" className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Achievement Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`
                    bg-white rounded-xl p-4 text-center transition-all duration-300 border-2 cursor-pointer
                    ${badge.unlocked 
                      ? 'border-transparent shadow-md hover:shadow-xl hover:-translate-y-1' 
                      : 'border-gray-200 opacity-50'}
                  `}
                >
                  <div 
                    className={`w-14 h-14 rounded-xl mx-auto mb-2 flex items-center justify-center transition-all duration-300 ${badge.unlocked ? 'hover:scale-110' : ''}`}
                    style={{ backgroundColor: badge.bgColor }}
                  >
                    <Icon className="w-7 h-7" style={{ color: badge.color }} />
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                    {badge.name}
                  </h3>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${badge.unlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {badge.unlocked ? '✓' : badge.requirement}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBadge(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: selectedBadge.bgColor }}>
                    <selectedBadge.icon className="w-8 h-8" style={{ color: selectedBadge.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedBadge.name}</h3>
                    <p className={`text-sm font-semibold ${selectedBadge.unlocked ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {selectedBadge.unlocked ? '✓ Unlocked' : `Locked - ${selectedBadge.requirement}`}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedBadge(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedBadge.description}</p>
              {!selectedBadge.unlocked && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-900 mb-1">How to unlock:</p>
                  <p className="text-sm text-purple-700">{selectedBadge.requirement}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsChallenges;