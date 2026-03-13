"use client"
import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Flame, Target, Users, Filter, Search, Award, Zap, ChevronDown } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  savings: number;
  streak: number;
  challenges: number;
  points: number;
  badge: string;
  isCurrentUser?: boolean;
}

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'local'>('all');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('month');
  const [searchQuery, setSearchQuery] = useState('');

  const leaderboardData: LeaderboardUser[] = [
    { rank: 1, name: 'Kunal Gupta', avatar: '👩‍💼', savings: 2850, streak: 45, challenges: 3, points: 9500, badge: 'Legendary' },
    { rank: 2, name: 'Rohan Kumar', avatar: '👨‍💻', savings: 2640, streak: 42, challenges: 3, points: 8900, badge: 'Legendary' },
    { rank: 3, name: 'Kartikey Pal', avatar: '👩‍🎓', savings: 2420, streak: 38, challenges: 2, points: 8200, badge: 'Master' },
    { rank: 4, name: 'Rohan kashyap', avatar: '👨‍🔬', savings: 2180, streak: 35, challenges: 2, points: 7600, badge: 'Master' },
    { rank: 5, name: 'Aryan Yadav', avatar: '👩‍⚕️', savings: 1950, streak: 32, challenges: 2, points: 7100, badge: 'Expert' },
    { rank: 6, name: 'Tushar Verma', avatar: '👨‍🎨', savings: 1820, streak: 30, challenges: 2, points: 6800, badge: 'Expert' },
    { rank: 7, name: 'Shashank Avasti', avatar: '👩‍🏫', savings: 1690, streak: 28, challenges: 1, points: 6400, badge: 'Expert' },
    { rank: 8, name: 'Uday kumar', avatar: '👨‍💼', savings: 1560, streak: 25, challenges: 1, points: 5900, badge: 'Advanced' },
    { rank: 9, name: 'Anmol Sharma', avatar: '👩‍🔧', savings: 1440, streak: 23, challenges: 1, points: 5500, badge: 'Advanced' },
    { rank: 10, name: 'Ronak Mittal ', avatar: '👨‍🚀', savings: 1320, streak: 21, challenges: 1, points: 5200, badge: 'Advanced' },
    { rank: 11, name: 'Shantanu Tawara', avatar: '👩‍🎤', savings: 1210, streak: 19, challenges: 1, points: 4800, badge: 'Apprentice' },
    
  ];

  const getBadgeColor = (badge: string) => {
    const colors = {
      'Legendary': 'from-purple-500 via-pink-500 to-rose-500',
      'Master': 'from-blue-500 via-cyan-500 to-teal-500',
      'Expert': 'from-emerald-500 via-green-500 to-lime-500',
      'Advanced': 'from-orange-500 via-amber-500 to-yellow-500',
      'Apprentice': 'from-slate-400 via-gray-500 to-zinc-500',
      'Novice': 'from-stone-400 via-neutral-500 to-gray-600'
    };
    return colors[badge as keyof typeof colors] || 'from-gray-300 to-gray-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const topThree = leaderboardData.slice(0, 3);
  const restOfLeaders = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 pt-24 pb-16 px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 float-animation">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-base text-gray-600 font-medium ml-13">
            Compete with top savers and climb the ranks!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs font-semibold text-gray-500 uppercase">Total Savers</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">₹1.2M</p>
                <p className="text-xs font-semibold text-gray-500 uppercase">Total Saved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">45</p>
                <p className="text-xs font-semibold text-gray-500 uppercase">Top Streak</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-xs font-semibold text-gray-500 uppercase">Challenges Done</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
       

            

        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Performers</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {/* 2nd Place */}
            <div className="order-1 md:order-1">
              <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-block mb-3">
                    <Medal className="w-12 h-12 text-gray-600" />
                  </div>
                  <div className="text-4xl mb-2">{topThree[1].avatar}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{topThree[1].name}</h3>
                  <div className="bg-white/30 backdrop-blur-sm rounded-lg px-3 py-1 inline-block mb-3">
                    <p className="text-2xl font-bold text-gray-900">₹{topThree[1].savings}</p>
                    <p className="text-xs text-gray-700">Total Saved</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold">{topThree[1].streak}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold">{topThree[1].points}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="order-2 md:order-2 md:-mt-4">
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-block mb-3">
                    <Crown className="w-16 h-16 text-yellow-700 float-animation" />
                  </div>
                  <div className="text-5xl mb-3">{topThree[0].avatar}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{topThree[0].name}</h3>
                  <div className="bg-white/40 backdrop-blur-sm rounded-lg px-4 py-2 inline-block mb-4">
                    <p className="text-3xl font-bold text-gray-900">₹{topThree[0].savings}</p>
                    <p className="text-sm text-gray-700">Total Saved</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-base">
                    <div className="flex items-center gap-1">
                      <Flame className="w-5 h-5 text-orange-600" />
                      <span className="font-bold">{topThree[0].streak}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-700" />
                      <span className="font-bold">{topThree[0].points}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3 md:order-3">
              <div className="bg-gradient-to-br from-orange-200 to-orange-400 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-block mb-3">
                    <Medal className="w-12 h-12 text-orange-700" />
                  </div>
                  <div className="text-4xl mb-2">{topThree[2].avatar}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{topThree[2].name}</h3>
                  <div className="bg-white/30 backdrop-blur-sm rounded-lg px-3 py-1 inline-block mb-3">
                    <p className="text-2xl font-bold text-gray-900">₹{topThree[2].savings}</p>
                    <p className="text-xs text-gray-700">Total Saved</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold">{topThree[2].streak}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="font-semibold">{topThree[2].points}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Badge</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Savings</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Streak</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Challenges</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Points</th>
                </tr>
              </thead>
              <tbody>
                {restOfLeaders.map((user, index) => (
                  <tr
                    key={user.rank}
                    className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ₹{
                      user.isCurrentUser ? 'bg-purple-100 font-semibold' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100">
                        {getRankIcon(user.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{user.avatar}</div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          {user.isCurrentUser && (
                            <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-semibold">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ₹{getBadgeColor(user.badge)} text-black text-xs font-bold shadow-md `}>
                        <Award className="w-3 h-3 text-black" />
                        {user.badge}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-emerald-600">₹{user.savings}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-black">{user.streak} days</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold text-black">{user.challenges}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-gray-900">{user.points}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;