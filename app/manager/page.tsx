"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, X, Edit2, Trash2, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'borrow' | 'lend';
  category: string;
  amount: number;
  date: string;
  description: string;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function FinanceDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'income', category: 'Salary', amount: 50000, date: '2026-01-20', description: 'Monthly salary' },
    { id: 2, type: 'expense', category: 'Food & Dining', amount: 3500, date: '2026-01-19', description: 'Groceries and restaurants' },
    { id: 3, type: 'expense', category: 'Transport', amount: 1200, date: '2026-01-18', description: 'Fuel and metro' },
    { id: 4, type: 'income', category: 'Freelance', amount: 8000, date: '2026-01-17', description: 'Web design project' },
    { id: 5, type: 'expense', category: 'Entertainment', amount: 1500, date: '2026-01-16', description: 'Movies and streaming' },
    { id: 6, type: 'borrow', category: 'Personal Loan', amount: 5000, date: '2026-01-15', description: 'Borrowed from friend' },
    { id: 7, type: 'lend', category: 'Loan Given', amount: 2000, date: '2026-01-14', description: 'Lent to colleague' },
    
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type: 'expense',
    category: '',
    amount: 0,
    date: '2026-01-25',
    description: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = {
    income: ['Salary', 'Freelance', 'Investment Return', 'Gift', 'Other Income'],
    expense: ['Food & Dining', 'Transport', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Other Expense'],
    borrow: ['Personal Loan', 'Credit Card', 'Bank Loan', 'Other Borrow'],
    lend: ['Loan Given', 'Advance Given', 'Other Lend']
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBorrow = transactions.filter(t => t.type === 'borrow').reduce((sum, t) => sum + t.amount, 0);
  const totalLend = transactions.filter(t => t.type === 'lend').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense + totalBorrow - totalLend;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  const monthlyTrend = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, t) => {
      const date = t.date;
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (t.type === 'income') acc[date].income += t.amount;
      if (t.type === 'expense') acc[date].expense += t.amount;
      return acc;
    }, {} as Record<string, any>);

  const trendData = Object.values(monthlyTrend);

  const handleSubmit = () => {
    if (!formData.category || !formData.amount || !formData.description) {
      alert('Please fill in all fields');
      return;
    }
    
    if (editingId) {
      setTransactions(transactions.map(t => t.id === editingId ? { ...formData, id: editingId } : t));
      setEditingId(null);
    } else {
      const newTransaction: Transaction = {
        ...formData,
        id: Math.max(...transactions.map(t => t.id), 0) + 1
      };
      setTransactions([newTransaction, ...transactions]);
    }
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      amount: 0,
      date: '2026-01-25',
      description: ''
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description
    });
    setEditingId(transaction.id);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const exportData = () => {
    const csv = [
      ['Date', 'Type', 'Category', 'Amount', 'Description'],
      ...transactions.map(t => [t.date, t.type, t.category, t.amount.toString(), t.description])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 pt-20 md:pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Finance Dashboard</h1>
          <p className="text-gray-600">Track your money flow and make smarter financial decisions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Income</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <ArrowUpRight size={16} />
              <span className="ml-1">Cash inflow</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">₹{totalExpense.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="text-red-600" size={24} />
              </div>
            </div>
            <div className="flex items-center text-red-600 text-sm">
              <ArrowDownRight size={16} />
              <span className="ml-1">Cash outflow</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Net Balance</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">₹{netBalance.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Wallet className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="flex items-center text-blue-600 text-sm">
              <PiggyBank size={16} />
              <span className="ml-1">{savingsRate}% savings rate</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm font-medium">Borrow/Lend Net</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">₹{(totalBorrow - totalLend).toLocaleString()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <CreditCard className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <span>Borrowed: ₹{totalBorrow.toLocaleString()} | Lent: ₹{totalLend.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Income vs Expense Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Income vs Expense Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add Transaction
          </button>
          <button
            onClick={exportData}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition flex items-center gap-2"
          >
            <Download size={20} />
            Export Data
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Description</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-semibold">Amount</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-700">{transaction.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-700' :
                        transaction.type === 'expense' ? 'bg-red-100 text-red-700' :
                        transaction.type === 'borrow' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {transaction.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{transaction.category}</td>
                    <td className="py-3 px-4 text-gray-600">{transaction.description}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' :
                      transaction.type === 'expense' ? 'text-red-600' :
                      transaction.type === 'borrow' ? 'text-orange-600' :
                      'text-blue-600'
                    }`}>
                      {transaction.type === 'income' || transaction.type === 'borrow' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Edit Transaction' : 'Add Transaction'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any, category: '' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="borrow">Borrow</option>
                    <option value="lend">Lend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="">Select category</option>
                    {categories[formData.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition"
                >
                  {editingId ? 'Update Transaction' : 'Add Transaction'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}