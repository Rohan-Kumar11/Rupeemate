"use client";
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Filter, ArrowUpRight, ArrowDownRight, Star, Eye, Plus, Minus, DollarSign, PieChart, BarChart3, Calculator, Bell, RefreshCw, Download, Share2, User, Settings, LogOut, Activity, Briefcase, History, Target, ChevronDown, ChevronUp, X, Info, AlertCircle, CheckCircle, TrendingUpDown } from 'lucide-react';

interface Fund {
  id: number;
  name: string;
  category: string;
  nav: number;
  change: number;
  changePercent: number;
  returns: Record<'1m' | '6m' | '1y' | '3y' | '5y', number>;
  rating: number;
  aum: string;
  expenseRatio: number;
  minInvestment: number;
  riskLevel: string;
  exitLoad: string;
  fundManager: string;
  benchmarkIndex: string;
  sipAllowed: boolean;
  dividendOption: boolean;
  lockInPeriod: string;
  launchDate: string;
}

type SortOption = 'returns' | 'nav' | 'rating' | 'aum';

const MutualFundsPlatform = () => {
  const [selectedTab, setSelectedTab] = useState<'explore' | 'watchlist'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [watchlist, setWatchlist] = useState<number[]>([1, 3]);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [sortBy, setSortBy] = useState<SortOption>('returns');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonFunds, setComparisonFunds] = useState<number[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investmentType, setInvestmentType] = useState<'lumpsum' | 'sip'>('lumpsum');

  const [userProfile] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    pan: 'ABCDE1234F',
    kyc: 'Verified',
    totalInvested: 97000,
    currentValue: 105420,
    totalReturns: 8420,
    returnsPercent: 8.68
  });

  const [notifications] = useState([
    { id: 1, type: 'success', title: 'SIP Executed', message: 'Your SIP of ₹5,000 in HDFC Top 100 Fund executed successfully', time: '2 hours ago' },
    { id: 2, type: 'info', title: 'NAV Update', message: 'Your portfolio is up by 2.3% today', time: '5 hours ago' },
    { id: 3, type: 'warning', title: 'Rebalance Alert', message: 'Consider rebalancing - Large cap allocation exceeds 70%', time: '1 day ago' },
    { id: 4, type: 'info', title: 'New Fund', message: 'Mirae Asset launched a new Flexi Cap fund', time: '2 days ago' }
  ]);

  const [funds, setFunds] = useState<Fund[]>([
    {
      id: 1,
      name: 'HDFC Top 100 Fund',
      category: 'Large Cap',
      nav: 752.34,
      change: 2.34,
      changePercent: 0.31,
      returns: { '1m': 3.2, '6m': 8.5, '1y': 18.5, '3y': 15.2, '5y': 14.8 },
      rating: 5,
      aum: '₹45,231 Cr',
      expenseRatio: 1.05,
      minInvestment: 500,
      riskLevel: 'Moderate',
      exitLoad: '1% if redeemed within 1 year',
      fundManager: 'Chirag Setalvad',
      benchmarkIndex: 'S&P BSE 100',
      sipAllowed: true,
      dividendOption: true,
      lockInPeriod: 'Nil',
      launchDate: '2010-01-01'
    },
    {
      id: 2,
      name: 'ICICI Prudential Technology Fund',
      category: 'Sectoral',
      nav: 142.89,
      change: -1.23,
      changePercent: -0.85,
      returns: { '1m': 5.8, '6m': 15.2, '1y': 28.3, '3y': 22.1, '5y': 19.5 },
      rating: 4,
      aum: '₹12,456 Cr',
      expenseRatio: 1.89,
      minInvestment: 1000,
      riskLevel: 'High',
      exitLoad: '1% if redeemed within 1 year',
      fundManager: 'Sankaran Naren',
      benchmarkIndex: 'S&P BSE IT Index',
      sipAllowed: true,
      dividendOption: false,
      lockInPeriod: 'Nil',
      launchDate: '2015-03-15'
    },
    {
      id: 3,
      name: 'SBI Small Cap Fund',
      category: 'Small Cap',
      nav: 98.67,
      change: 3.45,
      changePercent: 3.62,
      returns: { '1m': 7.1, '6m': 18.3, '1y': 32.4, '3y': 24.6, '5y': 21.3 },
      rating: 5,
      aum: '₹8,934 Cr',
      expenseRatio: 1.25,
      minInvestment: 500,
      riskLevel: 'Very High',
      exitLoad: '1% if redeemed within 1 year',
      fundManager: 'R. Srinivasan',
      benchmarkIndex: 'S&P BSE Small Cap',
      sipAllowed: true,
      dividendOption: true,
      lockInPeriod: 'Nil',
      launchDate: '2012-09-10'
    },
    {
      id: 4,
      name: 'Axis Bluechip Fund',
      category: 'Large Cap',
      nav: 56.23,
      change: 0.89,
      changePercent: 1.61,
      returns: { '1m': 2.8, '6m': 7.9, '1y': 16.8, '3y': 14.5, '5y': 13.2 },
      rating: 4,
      aum: '₹32,567 Cr',
      expenseRatio: 0.95,
      minInvestment: 500,
      riskLevel: 'Moderate',
      exitLoad: 'Nil',
      fundManager: 'Shreyash Devalkar',
      benchmarkIndex: 'Nifty 100',
      sipAllowed: true,
      dividendOption: true,
      lockInPeriod: 'Nil',
      launchDate: '2013-12-01'
    },
    {
      id: 5,
      name: 'Mirae Asset Emerging Bluechip',
      category: 'Large & Mid Cap',
      nav: 125.45,
      change: 1.67,
      changePercent: 1.35,
      returns: { '1m': 4.2, '6m': 11.5, '1y': 22.3, '3y': 18.9, '5y': 17.1 },
      rating: 5,
      aum: '₹28,901 Cr',
      expenseRatio: 1.15,
      minInvestment: 1000,
      riskLevel: 'Moderately High',
      exitLoad: '1% if redeemed within 365 days',
      fundManager: 'Neelesh Surana',
      benchmarkIndex: 'Nifty LargeMid 250',
      sipAllowed: true,
      dividendOption: false,
      lockInPeriod: 'Nil',
      launchDate: '2010-07-03'
    },
    {
      id: 6,
      name: 'Parag Parikh Flexi Cap Fund',
      category: 'Flexi Cap',
      nav: 78.92,
      change: 2.11,
      changePercent: 2.75,
      returns: { '1m': 5.5, '6m': 13.2, '1y': 25.6, '3y': 20.4, '5y': 18.7 },
      rating: 5,
      aum: '₹51,234 Cr',
      expenseRatio: 1.02,
      minInvestment: 1000,
      riskLevel: 'Moderately High',
      exitLoad: '2% if redeemed within 1 year',
      fundManager: 'Rajeev Thakkar',
      benchmarkIndex: 'S&P BSE 500',
      sipAllowed: true,
      dividendOption: true,
      lockInPeriod: 'Nil',
      launchDate: '2013-05-28'
    },
    {
      id: 7,
      name: 'Kotak Corporate Bond Fund',
      category: 'Debt',
      nav: 3245.67,
      change: 0.45,
      changePercent: 0.01,
      returns: { '1m': 0.6, '6m': 3.5, '1y': 7.2, '3y': 6.8, '5y': 7.1 },
      rating: 4,
      aum: '₹15,678 Cr',
      expenseRatio: 0.45,
      minInvestment: 5000,
      riskLevel: 'Low',
      exitLoad: 'Nil',
      fundManager: 'Deepak Agarwal',
      benchmarkIndex: 'CRISIL Corporate Bond',
      sipAllowed: true,
      dividendOption: true,
      lockInPeriod: 'Nil',
      launchDate: '2014-11-20'
    },
    {
      id: 8,
      name: 'UTI Nifty Index Fund',
      category: 'Index Fund',
      nav: 234.56,
      change: 1.23,
      changePercent: 0.53,
      returns: { '1m': 2.5, '6m': 7.8, '1y': 17.2, '3y': 14.8, '5y': 13.9 },
      rating: 4,
      aum: '₹22,345 Cr',
      expenseRatio: 0.25,
      minInvestment: 500,
      riskLevel: 'Moderate',
      exitLoad: 'Nil',
      fundManager: 'Sharwan Kumar Goyal',
      benchmarkIndex: 'Nifty 50',
      sipAllowed: true,
      dividendOption: true,
      lockInPeriod: 'Nil',
      launchDate: '2011-04-05'
    },
    {
      id: 9,
      name: 'Motilal Oswal Nasdaq 100 FOF',
      category: 'International',
      nav: 45.67,
      change: 1.89,
      changePercent: 4.32,
      returns: { '1m': 6.8, '6m': 16.5, '1y': 35.2, '3y': 28.5, '5y': 25.3 },
      rating: 5,
      aum: '₹7,890 Cr',
      expenseRatio: 0.65,
      minInvestment: 5000,
      riskLevel: 'High',
      exitLoad: 'Nil',
      fundManager: 'Rakesh Shetty',
      benchmarkIndex: 'Nasdaq 100',
      sipAllowed: true,
      dividendOption: false,
      lockInPeriod: 'Nil',
      launchDate: '2018-10-12'
    },
    {
      id: 10,
      name: 'Axis ELSS Tax Saver Fund',
      category: 'ELSS',
      nav: 67.34,
      change: 0.98,
      changePercent: 1.48,
      returns: { '1m': 3.5, '6m': 9.2, '1y': 19.8, '3y': 16.5, '5y': 15.2 },
      rating: 5,
      aum: '₹18,456 Cr',
      expenseRatio: 0.89,
      minInvestment: 500,
      riskLevel: 'Moderately High',
      exitLoad: 'Nil',
      fundManager: 'Jinesh Gopani',
      benchmarkIndex: 'Nifty 500',
      sipAllowed: true,
      dividendOption: false,
      lockInPeriod: '3 Years',
      launchDate: '2009-12-30'
    }
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFunds(prevFunds => 
        prevFunds.map(fund => {
          const change = (Math.random() - 0.5) * 2;
          const newNav = fund.nav + change;
          return {
            ...fund,
            nav: newNav,
            change: change,
            changePercent: parseFloat((change / fund.nav * 100).toFixed(2))
          };
        })
      );
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleWatchlist = (fundId: number) => {
    setWatchlist(prev => 
      prev.includes(fundId) 
        ? prev.filter(id => id !== fundId)
        : [...prev, fundId]
    );
  };

  const addToComparison = (fundId: number) => {
    if (comparisonFunds.length < 4 && !comparisonFunds.includes(fundId)) {
      setComparisonFunds([...comparisonFunds, fundId]);
    }
  };

  const removeFromComparison = (fundId: number) => {
    setComparisonFunds(comparisonFunds.filter(id => id !== fundId));
  };

  const categories = ['all', 'Large Cap', 'Mid Cap', 'Small Cap', 'Large & Mid Cap', 'Flexi Cap', 'Sectoral', 'Debt', 'Index Fund', 'ELSS', 'International'];

  const sortFunds = (funds: Fund[]) => {
    switch (sortBy) {
      case 'returns':
        return [...funds].sort((a, b) => b.returns['1y'] - a.returns['1y']);
      case 'nav':
        return [...funds].sort((a, b) => b.nav - a.nav);
      case 'rating':
        return [...funds].sort((a, b) => b.rating - a.rating);
      case 'aum':
        return [...funds].sort((a, b) => parseFloat(b.aum.replace(/[^0-9.]/g, '')) - parseFloat(a.aum.replace(/[^0-9.]/g, '')));
      default:
        return funds;
    }
  };

  const filteredFunds = sortFunds(funds.filter((fund: Fund) => {
    const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fund.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || fund.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }));

  const FundCard = ({ fund, showActions = true }: { fund: Fund; showActions?: boolean }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{fund.name}</h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{fund.category}</span>
        </div>
        {showActions && (
          <div className="flex gap-1">
            <button 
              onClick={() => toggleWatchlist(fund.id)}
              className={`p-2 rounded-full hover:bg-gray-100 ${watchlist.includes(fund.id) ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              <Star size={18} fill={watchlist.includes(fund.id) ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={() => addToComparison(fund.id)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
              disabled={comparisonFunds.length >= 4}
            >
              <TrendingUpDown size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-gray-900">₹{fund.nav.toFixed(2)}</span>
        <span className={`flex items-center text-sm font-medium ${fund.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {fund.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {fund.changePercent >= 0 ? '+' : ''}{fund.changePercent.toFixed(2)}%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        <div>
          <div className="text-gray-500">1Y</div>
          <div className="font-semibold text-green-600">{fund.returns['1y']}%</div>
        </div>
        <div>
          <div className="text-gray-500">3Y</div>
          <div className="font-semibold text-green-600">{fund.returns['3y']}%</div>
        </div>
        <div>
          <div className="text-gray-500">5Y</div>
          <div className="font-semibold text-green-600">{fund.returns['5y']}%</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < fund.rating ? '#fbbf24' : 'none'} className="text-yellow-400" />
          ))}
        </div>
        <button 
          onClick={() => setSelectedFund(fund)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );

  const ExploreTab = () => (
    <div>
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search mutual funds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="returns">Sort by Returns</option>
            <option value="nav">Sort by NAV</option>
            <option value="rating">Sort by Rating</option>
            <option value="aum">Sort by AUM</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All Funds' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {filteredFunds.length} Funds Available
        </h2>
        <div className="flex items-center gap-4">
          {comparisonFunds.length > 0 && (
            <button
              onClick={() => setShowComparison(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <TrendingUpDown size={18} />
              Compare ({comparisonFunds.length})
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw size={14} />
            {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFunds.map(fund => (
          <FundCard key={fund.id} fund={fund} />
        ))}
      </div>
    </div>
  );

  const WatchlistTab = () => {
    const watchlistFunds = funds.filter(f => watchlist.includes(f.id));
    
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Watchlist</h2>
        {watchlistFunds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Star size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No funds in watchlist yet</p>
            <button 
              onClick={() => setSelectedTab('explore')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Explore Funds
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlistFunds.map(fund => (
              <FundCard key={fund.id} fund={fund} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const ComparisonModal = () => {
    const selectedFundsData = funds.filter(f => comparisonFunds.includes(f.id));
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Compare Funds</h2>
            <button onClick={() => setShowComparison(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Metric</th>
                  {selectedFundsData.map(fund => (
                    <th key={fund.id} className="text-left py-4 px-4">
                      <div className="font-semibold text-gray-900 mb-1">{fund.name}</div>
                      <button
                        onClick={() => removeFromComparison(fund.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">Current NAV</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-gray-900">₹{fund.nav.toFixed(2)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">Category</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-gray-900">{fund.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">1Y Return</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-green-600 font-semibold">{fund.returns['1y']}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">3Y Return</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-green-600 font-semibold">{fund.returns['3y']}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">5Y Return</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-green-600 font-semibold">{fund.returns['5y']}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">Expense Ratio</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-gray-900">{fund.expenseRatio}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">Risk Level</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-gray-900">{fund.riskLevel}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">Min Investment</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-gray-900">₹{fund.minInvestment}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">AUM</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4 text-gray-900">{fund.aum}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">Rating</td>
                  {selectedFundsData.map(fund => (
                    <td key={fund.id} className="py-3 px-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < fund.rating ? '#fbbf24' : 'none'} className="text-yellow-400" />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MutualFunds Pro</h1>
                <p className="text-xs text-gray-500">Real-time Investment Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold">
                <DollarSign size={18} />
                <span>₹{userProfile.currentValue.toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                <User size={20} />
              </button>
            </div>
          </div>

          <nav className="flex gap-1 mt-4">
            {[
              { id: 'explore', label: 'Explore', icon: Search },
              { id: 'watchlist', label: 'Watchlist', icon: Star }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'explore' | 'watchlist')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {showNotifications && (
        <div className="absolute right-4 top-20 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notif => (
              <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-full h-fit ${
                    notif.type === 'success' ? 'bg-green-100 text-green-600' :
                    notif.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {notif.type === 'success' && <CheckCircle size={16} />}
                    {notif.type === 'warning' && <AlertCircle size={16} />}
                    {notif.type === 'info' && <Info size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showProfile && (
        <div className="absolute right-4 top-20 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{userProfile.name}</p>
                <p className="text-sm text-gray-500">{userProfile.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">PAN</span>
                <span className="font-medium">{userProfile.pan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KYC Status</span>
                <span className="text-green-600 font-medium">{userProfile.kyc}</span>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded flex items-center gap-2">
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded flex items-center gap-2 text-red-600">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {selectedTab === 'explore' && <ExploreTab />}
        {selectedTab === 'watchlist' && <WatchlistTab />}
      </main>

      {selectedFund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedFund.name}</h2>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {selectedFund.category}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedFund(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current NAV</p>
                  <p className="text-2xl font-bold text-gray-900">₹{selectedFund.nav.toFixed(2)}</p>
                  <p className={`text-sm ${selectedFund.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedFund.changePercent >= 0 ? '+' : ''}{selectedFund.changePercent.toFixed(2)}% today
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Fund Manager</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedFund.fundManager}</p>
                  <p className="text-sm text-gray-600">{selectedFund.aum} AUM</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Returns Performance</h3>
                <div className="grid grid-cols-5 gap-2">
                  {(['1m', '6m', '1y', '3y', '5y'] as const).map(period => (
                    <div key={period} className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600">{period.toUpperCase()}</p>
                      <p className="text-lg font-bold text-green-600">{selectedFund.returns[period]}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Benchmark</span>
                  <span className="font-semibold">{selectedFund.benchmarkIndex}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Expense Ratio</span>
                  <span className="font-semibold">{selectedFund.expenseRatio}%</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Minimum Investment</span>
                  <span className="font-semibold">₹{selectedFund.minInvestment}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-semibold">{selectedFund.riskLevel}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Exit Load</span>
                  <span className="font-semibold">{selectedFund.exitLoad}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Lock-in Period</span>
                  <span className="font-semibold">{selectedFund.lockInPeriod}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setInvestmentType('lumpsum');
                    setShowInvestModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Invest Now
                </button>
                <button 
                  onClick={() => {
                    setInvestmentType('sip');
                    setShowInvestModal(true);
                  }}
                  className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
                >
                  Start SIP
                </button>
                <button 
                  onClick={() => {
                    addToComparison(selectedFund.id);
                    setSelectedFund(null);
                  }}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <TrendingUpDown size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showComparison && <ComparisonModal />}

      {showInvestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {investmentType === 'lumpsum' ? 'One-time Investment' : 'Start SIP'}
              </h3>
              <button onClick={() => setShowInvestModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutualFundsPlatform;