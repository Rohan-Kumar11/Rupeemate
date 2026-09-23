"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusCircle, TrendingUp, TrendingDown, Wallet, PiggyBank, CreditCard, X, Edit2, Trash2,
  Download, ArrowUpRight, ArrowDownRight, AlertTriangle, Zap, ShieldCheck, Receipt, Gauge,
  Loader2, CheckCircle2, Wifi, WifiOff
} from 'lucide-react';
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, ReferenceLine
} from 'recharts';
// NOTE: adjust this import path/export name to match your actual lib/supabase.ts,
// e.g. `export const supabase = createClient(url, anonKey)`.
import { supabase } from '@/lib/supabase';

// Your generated Database type doesn't know about `transactions` yet (only
// profiles/chat_messages/chat_sessions), which is what caused the ts(2769)/ts(2345)
// overload errors. Run sql/create_transactions_table.sql in Supabase, then regenerate
// types with `npx supabase gen types typescript ... > types/supabase.ts` and this
// helper becomes unnecessary — you can go back to plain `supabase.from('transactions')`.
const txTable = () => (supabase as any).from('transactions');

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'borrow' | 'lend';
  category: string;
  amount: number;
  date: string;
  description: string;
  source?: string;
  payment_mode?: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card' | 'Other';
}

type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

// ── Palette: navy/ink for structure, teal for growth, amber for gig-income energy, rose for outflow ──
const INK = '#101828';
const TEAL = '#0F6E5D';
const AMBER = '#C77D22';
const ROSE = '#B4444B';
const INDIGO = '#4C4FAE';
const SAND = '#8A6D3B';

const EXPENSE_COLORS = [ROSE, AMBER, '#7C5CBF', INDIGO, '#3F8C7A', '#9A6B4F'];
const ALLOCATION_COLORS = [TEAL, INDIGO, AMBER, SAND];

const today = () => new Date().toISOString().split('T')[0];
const tempId = () => `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const ALLOCATIONS: Record<RiskProfile, { name: string; value: number }[]> = {
  conservative: [
    { name: 'Debt Funds / FD', value: 55 },
    { name: 'Gold', value: 20 },
    { name: 'Equity Mutual Funds', value: 25 },
  ],
  moderate: [
    { name: 'Equity Mutual Funds', value: 45 },
    { name: 'Debt Funds / FD', value: 35 },
    { name: 'Gold', value: 20 },
  ],
  aggressive: [
    { name: 'Equity Mutual Funds', value: 55 },
    { name: 'Direct Stocks', value: 30 },
    { name: 'Debt / Gold', value: 15 },
  ],
};

const RISK_COPY: Record<RiskProfile, string> = {
  conservative: 'Priority on capital protection — larger debt/FD cushion so a lean earning week never forces you to sell.',
  moderate: 'A balanced split — enough equity to grow your money, enough debt to ride out slow gig seasons.',
  aggressive: 'Growth-first — suited if your income base is steady enough to absorb short-term market swings.',
};

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 'demo-1', type: 'income', category: 'Food Delivery (Swiggy/Zomato)', amount: 4200, date: '2026-09-01', description: 'Weekday delivery shifts', source: 'Swiggy', payment_mode: 'UPI' },
  { id: 'demo-2', type: 'income', category: 'Ride-hailing (Uber/Ola)', amount: 6800, date: '2026-09-03', description: 'Weekend surge rides', source: 'Uber', payment_mode: 'Bank Transfer' },
  { id: 'demo-3', type: 'expense', category: 'Fuel & Vehicle', amount: 2100, date: '2026-09-03', description: 'Fuel and bike servicing', payment_mode: 'Cash' },
  { id: 'demo-4', type: 'income', category: 'Freelance / Contract Work', amount: 12000, date: '2026-09-06', description: 'Logo design project', source: 'Upwork', payment_mode: 'Bank Transfer' },
  { id: 'demo-5', type: 'expense', category: 'Food & Dining', amount: 1800, date: '2026-09-07', description: 'Groceries', payment_mode: 'UPI' },
  { id: 'demo-6', type: 'income', category: 'Food Delivery (Swiggy/Zomato)', amount: 1900, date: '2026-09-10', description: 'Slow rainy week', source: 'Zomato', payment_mode: 'UPI' },
  { id: 'demo-7', type: 'expense', category: 'Bills & Utilities', amount: 1500, date: '2026-09-11', description: 'Phone & data recharge', payment_mode: 'UPI' },
  { id: 'demo-8', type: 'income', category: 'Ride-hailing (Uber/Ola)', amount: 5300, date: '2026-09-13', description: 'Regular shifts', source: 'Ola', payment_mode: 'Bank Transfer' },
  { id: 'demo-9', type: 'income', category: 'Home Services (Urban Company)', amount: 3400, date: '2026-09-15', description: 'Appliance repair jobs', source: 'Urban Company', payment_mode: 'UPI' },
  { id: 'demo-10', type: 'expense', category: 'Healthcare', amount: 900, date: '2026-09-16', description: 'Clinic visit', payment_mode: 'Cash' },
  { id: 'demo-11', type: 'income', category: 'Freelance / Contract Work', amount: 900, date: '2026-09-19', description: 'Very quiet week', source: 'Fiverr', payment_mode: 'UPI' },
  { id: 'demo-12', type: 'expense', category: 'Fuel & Vehicle', amount: 1950, date: '2026-09-20', description: 'Fuel top-up', payment_mode: 'Cash' },
  { id: 'demo-13', type: 'borrow', category: 'Personal Loan', amount: 5000, date: '2026-09-08', description: 'Borrowed to cover a lean week', payment_mode: 'Bank Transfer' },
  { id: 'demo-14', type: 'lend', category: 'Loan Given', amount: 1200, date: '2026-09-12', description: 'Lent to a fellow rider', payment_mode: 'Cash' },
];

// Recharts' Tooltip formatter type is stricter than the plain arrow functions we need,
// so this small helper avoids the ts(2322) "Formatter<string|number,NameType>" mismatch.
const currencyFormatter = (value: any): string => `₹${Number(value ?? 0).toLocaleString()}`;
const percentFormatter = (value: any): string => `${value ?? 0}%`;

export default function FinanceDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [syncError, setSyncError] = useState('');
  const [saving, setSaving] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('moderate');
  const [autoSaveConfirmed, setAutoSaveConfirmed] = useState(false);

  const emptyForm: Omit<Transaction, 'id'> = {
    type: 'expense', category: '', amount: 0, date: today(), description: '', source: '', payment_mode: 'UPI'
  };
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>(emptyForm);

  const categories = {
    income: ['Ride-hailing (Uber/Ola)', 'Food Delivery (Swiggy/Zomato)', 'Freelance / Contract Work', 'Home Services (Urban Company)', 'Content / Gig Platforms', 'Other Gig Income'],
    expense: ['Food & Dining', 'Fuel & Vehicle', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Savings / Investment Transfer', 'Other Expense'],
    borrow: ['Personal Loan', 'Credit Card', 'Bank Loan', 'Other Borrow'],
    lend: ['Loan Given', 'Advance Given', 'Other Lend']
  };
  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  // ── Load session + transactions from Supabase, fall back to demo data ──
  const loadTransactions = useCallback(async (uid: string) => {
    const { data, error } = await txTable()
      .select('*')
      .eq('user_id', uid)
      .order('date', { ascending: false });

    if (error) {
      setSyncError(`Could not load your saved transactions (${error.message}). Showing demo data instead.`);
      setTransactions(DEMO_TRANSACTIONS);
      setIsDemoMode(true);
    } else if (!data || data.length === 0) {
      setTransactions([]);
      setIsDemoMode(false);
    } else {
      setTransactions(data as Transaction[]);
      setIsDemoMode(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    let unsub: { unsubscribe: () => void } | undefined;

    (async () => {
      setLoadingData(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await loadTransactions(user.id);
        } else {
          setUserId(null);
          setIsDemoMode(true);
          setTransactions(DEMO_TRANSACTIONS);
        }
      } catch (e: any) {
        setSyncError('Could not reach Supabase — working in demo mode.');
        setIsDemoMode(true);
        setTransactions(DEMO_TRANSACTIONS);
      } finally {
        setLoadingData(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      if (session?.user) {
        setUserId(session.user.id);
        setLoadingData(true);
        await loadTransactions(session.user.id);
        setLoadingData(false);
      } else {
        setUserId(null);
        setIsDemoMode(true);
        setTransactions(DEMO_TRANSACTIONS);
      }
    });
    unsub = listener?.subscription;

    return () => unsub?.unsubscribe();
  }, [loadTransactions]);

  // ── Core totals ──
  const incomeTxns = transactions.filter(t => t.type === 'income');
  const totalIncome = incomeTxns.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBorrow = transactions.filter(t => t.type === 'borrow').reduce((sum, t) => sum + t.amount, 0);
  const totalLend = transactions.filter(t => t.type === 'lend').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const savingsRate: string = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : '0.0';

  // ── Income volatility (the core PS-02 signal) ──
  const incomeAmounts = incomeTxns.map(t => t.amount);
  const avgIncome = incomeAmounts.length ? incomeAmounts.reduce((a, b) => a + b, 0) / incomeAmounts.length : 0;
  const stdDevIncome = incomeAmounts.length
    ? Math.sqrt(incomeAmounts.reduce((sum, v) => sum + Math.pow(v - avgIncome, 2), 0) / incomeAmounts.length)
    : 0;
  const volatilityCV = avgIncome > 0 ? (stdDevIncome / avgIncome) * 100 : 0;
  const volatilityLabel = volatilityCV < 20 ? 'Stable' : volatilityCV < 45 ? 'Moderate' : 'High';
  const volatilityColor = volatilityCV < 20 ? TEAL : volatilityCV < 45 ? AMBER : ROSE;

  const incomeSeries = [...incomeTxns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const volatilityData = incomeSeries.map(t => ({ date: t.date.slice(5), amount: t.amount, average: Math.round(avgIncome) }));

  // ── Safe-to-save suggestion ──
  const latestIncomeEntry = incomeSeries[incomeSeries.length - 1];
  const surplus = latestIncomeEntry ? latestIncomeEntry.amount - avgIncome : 0;
  const suggestedSaving = surplus > 0 ? Math.round(surplus * 0.3) : 0;

  // ── Income by gig source ──
  const incomeBySource = Object.entries(
    incomeTxns.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // ── Expense breakdown ──
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // ── Monthly income vs expense trend ──
  const monthlyTrend = transactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, t) => {
      const month = t.date.slice(0, 7);
      if (!acc[month]) acc[month] = { date: month, income: 0, expense: 0 };
      if (t.type === 'income') acc[month].income += t.amount;
      if (t.type === 'expense') acc[month].expense += t.amount;
      return acc;
    }, {} as Record<string, { date: string; income: number; expense: number }>);
  const trendData = Object.values(monthlyTrend);

  // ── Emergency fund progress ──
  const monthsSpanned = Math.max(1, trendData.length);
  const avgMonthlyExpense = totalExpense / monthsSpanned;
  const emergencyTarget = Math.round(avgMonthlyExpense * 3);
  const emergencyProgressPct = emergencyTarget > 0 ? Math.min(100, Math.max(0, (netBalance / emergencyTarget) * 100)) : 0;

  // ── Illustrative tax set-aside (Sec 44AD presumptive-style estimate, 8% of gross receipts) ──
  const estimatedTaxableIncome = Math.round(totalIncome * 0.08);
  const suggestedTaxSetAside = Math.round(estimatedTaxableIncome * 0.15);

  const allocationData = ALLOCATIONS[riskProfile];

  // ── Supabase-backed CRUD (falls back to local state in demo mode) ──
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.category) errors.category = 'Pick a category';
    if (!formData.amount || formData.amount <= 0) errors.amount = 'Enter an amount greater than 0';
    if (!formData.date) errors.date = 'Pick a date';
    if (!formData.description.trim()) errors.description = 'Add a short note';
    if (formData.type === 'income' && !formData.source?.trim()) errors.source = 'Which platform or client paid you?';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const persistTransaction = async (payload: Omit<Transaction, 'id'>, id: string | null) => {
    if (isDemoMode || !userId) {
      if (id) {
        setTransactions(prev => prev.map(t => t.id === id ? { ...payload, id } : t));
      } else {
        setTransactions(prev => [{ ...payload, id: tempId() }, ...prev]);
      }
      return;
    }
    if (id) {
      const { error } = await txTable().update(payload).eq('id', id).eq('user_id', userId);
      if (error) throw error;
      setTransactions(prev => prev.map(t => t.id === id ? { ...payload, id } : t));
    } else {
      const { data, error } = await txTable()
        .insert([{ ...payload, user_id: userId }])
        .select()
        .single();
      if (error) throw error;
      setTransactions(prev => [data as Transaction, ...prev]);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSaving(true);
    setSyncError('');
    try {
      await persistTransaction(formData, editingId);
      setShowModal(false);
      setEditingId(null);
      setFormData(emptyForm);
      setFieldErrors({});
    } catch (e: any) {
      setSyncError(`Couldn't save that transaction (${e.message ?? 'unknown error'}). It hasn't been recorded.`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setFormData({
      type: transaction.type, category: transaction.category, amount: transaction.amount,
      date: transaction.date, description: transaction.description,
      source: transaction.source ?? '', payment_mode: transaction.payment_mode ?? 'UPI'
    });
    setEditingId(transaction.id);
    setFieldErrors({});
    setShowModal(true);
  };

  const handleDeleteRequest = (id: string) => setDeleteConfirmId(id);

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId === null) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    if (isDemoMode || !userId) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      return;
    }
    const { error } = await txTable().delete().eq('id', id).eq('user_id', userId);
    if (error) {
      setSyncError(`Couldn't delete that transaction (${error.message}).`);
    } else {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAutoSave = async () => {
    if (suggestedSaving <= 0) return;
    setSaving(true);
    try {
      await persistTransaction({
        type: 'expense',
        category: 'Savings / Investment Transfer',
        amount: suggestedSaving,
        date: today(),
        description: 'Auto-save suggestion accepted',
        payment_mode: 'UPI'
      }, null);
      setAutoSaveConfirmed(true);
      setTimeout(() => setAutoSaveConfirmed(false), 3500);
    } catch (e: any) {
      setSyncError(`Couldn't record the auto-save (${e.message ?? 'unknown error'}).`);
    } finally {
      setSaving(false);
    }
  };

  const exportData = () => {
    const csv = [
      ['Date', 'Type', 'Category', 'Amount', 'Payment Mode', 'Source', 'Description'],
      ...transactions.map(t => [t.date, t.type, t.category, t.amount.toString(), t.payment_mode ?? '', t.source ?? '', t.description])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rupeemate-transactions.csv';
    a.click();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F6F7FB] p-4 md:p-8 pt-20 md:pt-24 font-sans text-[#101828]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your income, on its own terms</h1>
            <p className="text-slate-500 mt-1 max-w-xl">
              Built for gig work: no two weeks look the same, so RupeeMate tracks the pattern behind your earnings, not just the total.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              {isDemoMode ? <WifiOff size={16} className="text-slate-400" /> : <Wifi size={16} style={{ color: TEAL }} />}
              <span className="text-sm text-slate-600">{isDemoMode ? 'Demo data' : 'Synced'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <Gauge size={16} style={{ color: volatilityColor }} />
              <span className="text-sm text-slate-600">Volatility:</span>
              <span className="text-sm font-semibold" style={{ color: volatilityColor }}>{volatilityLabel}</span>
            </div>
          </div>
        </div>

        {isDemoMode && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            {userId
              ? "Couldn't load your saved transactions from Supabase — showing sample data so the dashboard stays usable."
              : "You're not signed in, so this is sample data. Sign in to load and save your real transactions."}
          </div>
        )}
        {syncError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> {syncError}
          </div>
        )}

        {loadingData ? (
          <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
            <Loader2 size={22} className="animate-spin" /> Loading your data…
          </div>
        ) : (
        <>
        {/* Summary strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 border-l-4" style={{ borderLeftColor: TEAL }}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-slate-500 text-sm font-medium">Total Income</p>
              <TrendingUp size={20} style={{ color: TEAL }} />
            </div>
            <p className="text-3xl font-bold tabular-nums">₹{totalIncome.toLocaleString()}</p>
            <div className="flex items-center text-sm mt-2" style={{ color: TEAL }}>
              <ArrowUpRight size={16} /><span className="ml-1">Across {incomeTxns.length} gig payouts</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 border-l-4" style={{ borderLeftColor: ROSE }}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-slate-500 text-sm font-medium">Total Expenses</p>
              <TrendingDown size={20} style={{ color: ROSE }} />
            </div>
            <p className="text-3xl font-bold tabular-nums">₹{totalExpense.toLocaleString()}</p>
            <div className="flex items-center text-sm mt-2" style={{ color: ROSE }}>
              <ArrowDownRight size={16} /><span className="ml-1">Cash outflow</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 border-l-4" style={{ borderLeftColor: INDIGO }}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-slate-500 text-sm font-medium">Net Balance</p>
              <Wallet size={20} style={{ color: INDIGO }} />
            </div>
            <p className="text-3xl font-bold tabular-nums">₹{netBalance.toLocaleString()}</p>
            <div className="flex items-center text-sm mt-2" style={{ color: INDIGO }}>
              <PiggyBank size={16} /><span className="ml-1">{savingsRate}% savings rate</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 border-l-4" style={{ borderLeftColor: AMBER }}>
            <div className="flex justify-between items-start mb-3">
              <p className="text-slate-500 text-sm font-medium">Borrow/Lend Net</p>
              <CreditCard size={20} style={{ color: AMBER }} />
            </div>
            <p className="text-3xl font-bold tabular-nums">₹{(totalBorrow - totalLend).toLocaleString()}</p>
            <div className="text-sm mt-2 text-slate-500">Borrowed ₹{totalBorrow.toLocaleString()} · Lent ₹{totalLend.toLocaleString()}</div>
          </div>
        </div>

        {/* Micro-savings suggestion strip */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${TEAL}1A` }}>
              <Zap size={20} style={{ color: TEAL }} />
            </div>
            <div>
              <p className="font-semibold">
                {suggestedSaving > 0 ? `This was a good earning day — set aside ₹${suggestedSaving.toLocaleString()}` : 'This was a lean earning day — skip saving, protect your buffer'}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                Based on your last payout of ₹{(latestIncomeEntry?.amount ?? 0).toLocaleString()} against your average of ₹{Math.round(avgIncome).toLocaleString()}. Micro-savings scale with what you actually earn, not a fixed monthly number.
              </p>
            </div>
          </div>
          <button
            onClick={handleAutoSave}
            disabled={suggestedSaving <= 0 || saving}
            className="whitespace-nowrap text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: INK }}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : autoSaveConfirmed ? <CheckCircle2 size={16} /> : null}
            {autoSaveConfirmed ? 'Saved!' : 'Auto-save this amount'}
          </button>
        </div>

        {/* ── Analytics: Income pattern ── */}
        <h2 className="text-lg font-semibold mb-3">Income pattern</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2">
            <h3 className="font-semibold mb-1">Earnings per payout vs your average</h3>
            <p className="text-sm text-slate-500 mb-4">Every dot is a real payout — the line is your rolling average.</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={volatilityData}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={AMBER} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={AMBER} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={currencyFormatter} />
                <Area type="monotone" dataKey="amount" stroke={AMBER} fill="url(#incomeFill)" strokeWidth={2} name="Payout" />
                <ReferenceLine y={Math.round(avgIncome)} stroke={INK} strokeDasharray="4 4" label={{ value: 'Average', fontSize: 11, position: 'insideTopLeft' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold mb-1">Where income comes from</h3>
            <p className="text-sm text-slate-500 mb-4">Diversified income sources absorb slow weeks better.</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={incomeBySource} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} />
                <Tooltip formatter={currencyFormatter} />
                <Bar dataKey="value" fill={TEAL} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Analytics: Spending + trend ── */}
        <h2 className="text-lg font-semibold mb-3">Spending &amp; cash flow</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold mb-4">Expense breakdown</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={95} innerRadius={55} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={currencyFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold mb-4">Income vs expense by month</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={currencyFormatter} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke={TEAL} strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke={ROSE} strokeWidth={2} name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Analytics: Investment + safety net + tax ── */}
        <h2 className="text-lg font-semibold mb-3">Plan ahead</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold mb-1">Recommended allocation</h3>
            <p className="text-sm text-slate-500 mb-3">Matched to your risk profile — not a fixed monthly SIP.</p>
            <div className="flex gap-2 mb-4">
              {(['conservative', 'moderate', 'aggressive'] as RiskProfile[]).map(rp => (
                <button
                  key={rp}
                  onClick={() => setRiskProfile(rp)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition capitalize ${
                    riskProfile === rp ? 'text-white border-transparent' : 'text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                  style={riskProfile === rp ? { backgroundColor: INK } : {}}
                >
                  {rp}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={allocationData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {allocationData.map((entry, index) => (
                    <Cell key={`alloc-${index}`} fill={ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={percentFormatter} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2">{RISK_COPY[riskProfile]}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} style={{ color: TEAL }} />
              <h3 className="font-semibold">Emergency buffer</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Target: 3 months of average expenses, so a slow gig season doesn't become a crisis.</p>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold tabular-nums">₹{Math.max(0, netBalance).toLocaleString()}</span>
              <span className="text-sm text-slate-500">of ₹{emergencyTarget.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${emergencyProgressPct}%`, backgroundColor: emergencyProgressPct >= 100 ? TEAL : AMBER }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{emergencyProgressPct.toFixed(0)}% funded</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <Receipt size={18} style={{ color: SAND }} />
              <h3 className="font-semibold">Tax set-aside estimate</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Illustrative only, using presumptive taxation (Sec 44AD, 8% of gross receipts) — not tax advice.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Estimated taxable income</span>
                <span className="font-semibold tabular-nums">₹{estimatedTaxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Suggested quarterly set-aside</span>
                <span className="font-semibold tabular-nums" style={{ color: SAND }}>₹{suggestedTaxSetAside.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/tax-center')}
              className="mt-4 w-full text-sm font-semibold border border-slate-300 rounded-lg py-2 hover:bg-slate-50 transition"
            >
              Open Tax Center
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => { setFormData(emptyForm); setEditingId(null); setFieldErrors({}); setShowModal(true); }}
            className="text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition"
            style={{ backgroundColor: INK }}
          >
            <PlusCircle size={20} /> Add Transaction
          </button>
          <button
            onClick={exportData}
            className="text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition"
            style={{ backgroundColor: TEAL }}
          >
            <Download size={20} /> Export Data
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            <span className="text-sm text-slate-500">
              Showing {Math.min(visibleCount, transactions.length)} of {transactions.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Date</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Type</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Category</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Payment</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-semibold text-sm">Description</th>
                  <th className="text-right py-3 px-4 text-slate-500 font-semibold text-sm">Amount</th>
                  <th className="text-center py-3 px-4 text-slate-500 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, visibleCount).map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-700 text-sm">{transaction.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor:
                            transaction.type === 'income' ? `${TEAL}1A` :
                            transaction.type === 'expense' ? `${ROSE}1A` :
                            transaction.type === 'borrow' ? `${AMBER}1A` : `${INDIGO}1A`,
                          color:
                            transaction.type === 'income' ? TEAL :
                            transaction.type === 'expense' ? ROSE :
                            transaction.type === 'borrow' ? AMBER : INDIGO
                        }}
                      >
                        {transaction.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-sm">
                      {transaction.category}
                      {transaction.source && <span className="block text-xs text-slate-400">{transaction.source}</span>}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-sm">{transaction.payment_mode ?? '—'}</td>
                    <td className="py-3 px-4 text-slate-500 text-sm">{transaction.description}</td>
                    <td
                      className="py-3 px-4 text-right font-semibold text-sm tabular-nums"
                      style={{
                        color:
                          transaction.type === 'income' ? TEAL :
                          transaction.type === 'expense' ? ROSE :
                          transaction.type === 'borrow' ? AMBER : INDIGO
                      }}
                    >
                      {transaction.type === 'income' || transaction.type === 'borrow' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(transaction)} className="text-slate-500 hover:text-slate-800 transition">
                          <Edit2 size={17} />
                        </button>
                        <button onClick={() => handleDeleteRequest(transaction.id)} className="hover:opacity-70 transition" style={{ color: ROSE }}>
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 text-sm">
                      No transactions yet — add your first payout or expense above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {transactions.length > 10 && (
            <div className="mt-4 flex gap-3 justify-center">
              {visibleCount < transactions.length && (
                <button onClick={() => setVisibleCount(v => v + 10)} className="text-sm font-medium hover:underline" style={{ color: INDIGO }}>
                  Load more
                </button>
              )}
              {visibleCount > 10 && (
                <button onClick={() => setVisibleCount(10)} className="text-sm text-slate-500 hover:underline">
                  Show less
                </button>
              )}
            </div>
          )}
        </div>
        </>
        )}

        {/* Add/Edit Transaction Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Log every payout and expense so your income-pattern insights stay accurate.</p>
                </div>
                <button
                  onClick={() => { setShowModal(false); setEditingId(null); setFormData(emptyForm); setFieldErrors({}); }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X size={24} />
                </button>
              </div>

              {syncError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} /> {syncError}
                </div>
              )}

              <div className="space-y-4">
                {/* Type selector as segmented control */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['income', 'expense', 'borrow', 'lend'] as Transaction['type'][]).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t, category: '' })}
                        className={`text-xs sm:text-sm py-2 rounded-lg border font-semibold capitalize transition ${
                          formData.type === t ? 'text-white border-transparent' : 'text-slate-600 border-slate-300 hover:border-slate-400'
                        }`}
                        style={formData.type === t ? { backgroundColor: INK } : {}}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent ${fieldErrors.category ? 'border-red-400' : 'border-slate-300'}`}
                    >
                      <option value="">Select category</option>
                      {categories[formData.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    {fieldErrors.category && <p className="text-xs text-red-600 mt-1">{fieldErrors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Payment mode</label>
                    <select
                      value={formData.payment_mode}
                      onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value as Transaction['payment_mode'] })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {formData.type === 'income' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Platform / client</label>
                    <input
                      type="text"
                      placeholder="e.g. Uber, Swiggy, a client's name"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent ${fieldErrors.source ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {fieldErrors.source && <p className="text-xs text-red-600 mt-1">{fieldErrors.source}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent ${fieldErrors.amount ? 'border-red-400' : 'border-slate-300'}`}
                    min="0" step="100"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {quickAmounts.map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData({ ...formData, amount: amt })}
                        className="text-xs px-2.5 py-1 rounded-full border border-slate-300 text-slate-600 hover:border-slate-400 transition"
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.amount && <p className="text-xs text-red-600 mt-1">{fieldErrors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    max={today()}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent ${fieldErrors.date ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {fieldErrors.date && <p className="text-xs text-red-600 mt-1">{fieldErrors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Note</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent ${fieldErrors.description ? 'border-red-400' : 'border-slate-300'}`}
                    rows={3}
                    placeholder="What was this for?"
                  />
                  {fieldErrors.description && <p className="text-xs text-red-600 mt-1">{fieldErrors.description}</p>}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ backgroundColor: INK }}
                >
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? 'Saving…' : editingId ? 'Update Transaction' : 'Add Transaction'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full" style={{ backgroundColor: `${ROSE}1A` }}>
                  <Trash2 style={{ color: ROSE }} size={28} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Transaction?</h3>
              <p className="text-slate-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition" style={{ backgroundColor: ROSE }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}