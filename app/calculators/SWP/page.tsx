"use client";

import React, { useState, useEffect } from 'react';
import { TrendingDown, Wallet, Calendar, Percent, PiggyBank, ArrowDownCircle, BarChart3, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const SWPCalculator: React.FC = () => {
  const [corpus, setCorpus] = useState<number>(500000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(5000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [duration, setDuration] = useState<number>(10);
  const [results, setResults] = useState({
    totalWithdrawn: 0,
    remainingCorpus: 0,
    totalValue: 0,
    monthsLasted: 0
  });
  const [chartData, setChartData] = useState<Array<{year: number, corpus: number, withdrawn: number}>>([]);

  useEffect(() => {
    calculateSWP();
  }, [corpus, monthlyWithdrawal, annualReturn, duration]);

  const calculateSWP = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = duration * 12;

    let balance = corpus;
    let totalWithdrawn = 0;
    let monthsLasted = 0;
    const yearlyData: Array<{year: number, corpus: number, withdrawn: number}> = [{year: 0, corpus: corpus, withdrawn: 0}];

    for (let i = 0; i < totalMonths; i++) {
      balance = balance * (1 + monthlyRate);
      
      if (balance >= monthlyWithdrawal) {
        balance -= monthlyWithdrawal;
        totalWithdrawn += monthlyWithdrawal;
        monthsLasted++;
      } else {
        break;
      }

      // Store data yearly
      if ((i + 1) % 12 === 0) {
        yearlyData.push({
          year: (i + 1) / 12,
          corpus: Math.round(balance),
          withdrawn: Math.round(totalWithdrawn)
        });
      }
    }

    setResults({
      totalWithdrawn,
      remainingCorpus: Math.max(0, balance),
      totalValue: Math.max(0, balance) + totalWithdrawn,
      monthsLasted
    });
    setChartData(yearlyData);
  };

  const formatCurrency = (value: number): string => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const withdrawalPercentage = ((monthlyWithdrawal * 12 / corpus) * 100).toFixed(2);
  const sustainablePeriod = (results.monthsLasted / 12).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-4 shadow-2xl">
            <ArrowDownCircle className="text-white" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-3">
            Withdrawal Planner
          </h1>
          <p className="text-gray-600 text-xl">Design Your Systematic Withdrawal Strategy</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <PiggyBank className="text-indigo-600" size={32} />
              Investment Parameters
            </h2>

            <div className="space-y-8">
              {/* Initial Corpus */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Wallet size={20} className="text-indigo-600" />
                    Investment Corpus
                  </label>
                  <span className="text-2xl font-bold text-gray-800">{formatCurrency(corpus)}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="50000"
                  value={corpus}
                  onChange={(e) => setCorpus(Number(e.target.value))}
                  className="w-full h-3 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹1L</span>
                  <span>₹1Cr</span>
                </div>
              </div>

              {/* Monthly Withdrawal */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <ArrowDownCircle size={20} className="text-emerald-600" />
                    Monthly Withdrawal
                  </label>
                  <span className="text-2xl font-bold text-emerald-600">{formatCurrency(monthlyWithdrawal)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="200000"
                  step="1000"
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                  className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹1K</span>
                  <span>₹2L</span>
                </div>
                <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <p className="text-sm text-emerald-800">
                    <strong>Annual Withdrawal:</strong> {formatCurrency(monthlyWithdrawal * 12)} ({withdrawalPercentage}% of corpus)
                  </p>
                </div>
              </div>

              {/* Expected Return */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Percent size={20} className="text-purple-600" />
                    Expected Annual Return
                  </label>
                  <span className="text-2xl font-bold text-purple-600">{annualReturn}%</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="0.5"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>4%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Time Horizon */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar size={20} className="text-pink-600" />
                    Planning Horizon
                  </label>
                  <span className="text-2xl font-bold text-pink-600">{duration} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Total Withdrawn Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <TrendingDown size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Withdrawn</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{formatCurrency(results.totalWithdrawn)}</p>
              <p className="text-emerald-100 text-sm">Over {sustainablePeriod} years</p>
            </div>

            {/* Remaining Corpus Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Wallet size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Remaining Corpus</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{formatCurrency(results.remainingCorpus)}</p>
              <p className="text-indigo-100 text-sm">After withdrawal period</p>
            </div>

            {/* Total Value Card */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <BarChart3 size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Total Benefit</h3>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{formatCurrency(results.totalValue)}</p>
              <p className="text-pink-100 text-sm">Withdrawn + Remaining</p>
            </div>

            {/* Sustainability Alert */}
            {results.monthsLasted < duration * 12 && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Info size={24} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-800 font-semibold mb-1">Sustainability Alert</h4>
                    <p className="text-yellow-700 text-sm">
                      Your corpus will last for {sustainablePeriod} years at current withdrawal rate. Consider reducing withdrawals or increasing returns.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={28} />
            Withdrawal Projection Over Time
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorWithdrawn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                stroke="#6b7280"
              />
              <YAxis 
                label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                stroke="#6b7280"
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                formatter={(value: number | string | undefined) => formatCurrency(Number(value ?? 0))}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="corpus" 
                stroke="#6366f1" 
                fillOpacity={1} 
                fill="url(#colorCorpus)"
                name="Remaining Corpus"
              />
              <Area 
                type="monotone" 
                dataKey="withdrawn" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorWithdrawn)"
                name="Total Withdrawn"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="text-indigo-600" size={28} />
            Understanding Your Withdrawal Plan
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">What is SWP?</h4>
              <p className="text-sm leading-relaxed">
                Systematic Withdrawal Plan lets you withdraw a fixed amount periodically from your investment while the remaining balance continues to grow, providing a steady income stream.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Optimal Withdrawal Rate</h4>
              <p className="text-sm leading-relaxed">
                Financial experts often suggest a 4-6% annual withdrawal rate for long-term sustainability. Your current rate is <strong className="text-emerald-600">{withdrawalPercentage}%</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SWPCalculator;