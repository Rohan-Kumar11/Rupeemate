"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  CheckCircle2,
  FileStack,
  Loader2,
  Pencil,
  PiggyBank,
  Plus,
  ShieldCheck,
  Sparkles,
  Stamp,
  Target,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export type SavingsGoal = {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  autoSaveEnabled: boolean;
  autoSaveAmount: number;
  autoSaveFrequency: "daily" | "weekly";
  notes?: string;
};

type Txn = {
  id: string;
  type: "income" | "expense" | "borrow" | "lend";
  category: string;
  amount: number;
  date: string;
  source?: string | null;
};

type UpcomingExpense = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isEssential: boolean;
  isPaid: boolean;
};

type SavingsTxn = {
  id: string;
  destination: "emergency_buffer" | "goal";
  goalId: string | null;
  amount: number;
  createdAt: string;
};

type BufferStatus = "low" | "healthy" | "full";

type Factor = { label: string; detail: string; effect: "up" | "down" | "neutral" };

// Steps 3-5: Financial Data Engine + Emergency Buffer Engine + Status Evaluation
type Baseline = {
  avgIncome: number;
  volatilityCV: number;
  volatilityLabel: string;
  hasHistory: boolean;
  suggestedMonths: number | null;
  monthlyEssential: number;
  essentialsSource: "logged" | "estimate" | "none";
  coverageMonths: number;
  targetBuffer: number;
  targetKnown: boolean;
  currentBuffer: number;
  coveragePct: number;
  monthsCovered: number;
  status: BufferStatus;
};

// Steps 6-7: Adaptive Savings Engine + AI Explanation Layer
type Plan = {
  payout: number;
  payoutVsAvg: number | null;
  dailyEssential: number;
  upcomingDue: number;
  upcomingCount: number;
  cover: number;
  safeBeforeSaving: number;
  status: BufferStatus;
  bufferAmount: number;
  goalAmount: number;
  goalId: string | null;
  headline: string;
  why: string;
  factors: Factor[];
};

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const categoryColor: Record<string, string> = {
  "Vehicle & Equipment": "#3F6B4D",
  "Rent Buffer": "#B8860B",
  "Health & Insurance": "#A6432D",
  "Skill & Tools": "#1B2B44",
  Other: "#8A8371",
};

// Buffer status thresholds, as a % of the target buffer.
const LOW_BELOW = 50; // < 50%  -> Low / Building; 50-99% -> Healthy; >= 100% -> Fully funded
// Share of a payout suggested for saving, by buffer status. ₹1,420 at 7% -> ₹100.
const SAVE_RATE: Record<BufferStatus, number> = { low: 0.07, healthy: 0.06, full: 0.05 };
// When the buffer is "Healthy", this share of the savings goes to the buffer, the rest to goals.
const HEALTHY_BUFFER_SHARE = 0.6;
const COVERAGE_OPTIONS = [1, 2, 3, 4, 6, 9, 12];

const STATUS_META: Record<BufferStatus, { label: string; range: string; action: string; color: string; icon: typeof Target }> = {
  low: { label: "Low / Building", range: "under 50%", action: "Prioritize emergency savings", color: "#A6432D", icon: AlertTriangle },
  healthy: { label: "Healthy", range: "50–99%", action: "Balance emergency savings with other goals", color: "#3F6B4D", icon: CheckCircle2 },
  full: { label: "Fully funded", range: "100% or more", action: "Redirect surplus toward investment / other goals", color: "#B8860B", icon: Target },
};

// Set this to your own API route once it exists (e.g. "/api/goals/explain") to get an AI-written
// explanation. It must accept POST { plan, baseline } and return { explanation: string }.
// While it's null, the page uses the built-in rule-based explanation.
const AI_EXPLAIN_ENDPOINT = null as string | null;

const card = "border border-[#D9D0B8] rounded-md bg-[#FCFAF4]";
const inputClass =
  "w-full bg-[#FCFAF4] border border-[#D9D0B8] rounded-md px-3.5 py-2.5 text-[#1B2B44] placeholder:text-[#9A927B] focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 transition-colors font-sans text-sm";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1B2B44] text-[#F7F3E9] font-medium rounded-md hover:bg-[#243A5E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const ghostBtn =
  "inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#D9D0B8] text-[#1B2B44] font-medium rounded-md hover:bg-[#F7F3E9] transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

const defaultGoals: SavingsGoal[] = [
  {
    id: "goal-1",
    name: "New delivery bike",
    category: "Vehicle & Equipment",
    targetAmount: 45000,
    currentAmount: 9000,
    targetDate: "2027-03-01",
    autoSaveEnabled: false,
    autoSaveAmount: 0,
    autoSaveFrequency: "daily",
    notes: "Replacing the old bike before the festive rush.",
  },
];

// ─────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────
const db = (table: string) => (supabase as any).from(table);
const rpc = (fn: string, args: Record<string, unknown>) => (supabase as any).rpc(fn, args);

const isJwtError = (err: any) => {
  const text = `${err?.message ?? ""} ${err?.code ?? ""}`.toLowerCase();
  return err?.status === 401 || text.includes("jwt") || text.includes("pgrst301");
};

// Runs a Supabase request; if the JWT expired, refreshes the session once and retries.
async function runWithRefresh<T extends { error: any }>(fn: () => PromiseLike<T>): Promise<T> {
  let res = await fn();
  if (res.error && isJwtError(res.error)) {
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (!refreshError) res = await fn();
  }
  return res;
}

const isMissingTable = (err: any) => {
  const text = `${err?.message ?? ""} ${err?.code ?? ""}`.toLowerCase();
  return text.includes("42p01") || text.includes("pgrst205") || text.includes("does not exist") || text.includes("schema cache");
};

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayISO = () => toISO(new Date());
const shiftDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const round10 = (n: number) => Math.round(n / 10) * 10;
const floor10 = (n: number) => Math.floor(n / 10) * 10;

function daysLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const joinPhrases = (parts: string[]) =>
  parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;

const mapGoal = (row: any): SavingsGoal => ({
  id: row.id,
  name: row.name,
  category: row.category,
  targetAmount: Number(row.target_amount),
  currentAmount: Number(row.current_amount),
  targetDate: row.target_date,
  autoSaveEnabled: row.auto_save_enabled,
  autoSaveAmount: Number(row.auto_save_amount),
  autoSaveFrequency: row.auto_save_frequency,
  notes: row.notes ?? undefined,
});

const mapUpcoming = (row: any): UpcomingExpense => ({
  id: row.id,
  name: row.name,
  amount: Number(row.amount),
  dueDate: row.due_date,
  isEssential: row.is_essential,
  isPaid: row.is_paid,
});

const mapTxn = (row: any): Txn => ({
  id: row.id,
  type: row.type,
  category: row.category,
  amount: Number(row.amount),
  date: row.date,
  source: row.source,
});

const mapSavingsTxn = (row: any): SavingsTxn => ({
  id: row.id,
  destination: row.destination,
  goalId: row.goal_id,
  amount: Number(row.amount),
  createdAt: row.created_at,
});

// Demo data (shown when signed out), dated relative to today so the workflow always has something to analyse.
const makeDemoTxns = (): Txn[] => {
  const mk = (id: string, type: Txn["type"], category: string, amount: number, ago: number, source?: string): Txn => ({
    id, type, category, amount, date: shiftDays(-ago), source: source ?? null,
  });
  return [
    mk("d1", "income", "Food Delivery (Swiggy/Zomato)", 4200, 26, "Swiggy"),
    mk("d2", "income", "Ride-hailing (Uber/Ola)", 6800, 23, "Uber"),
    mk("d3", "expense", "Fuel & Vehicle", 2100, 23),
    mk("d4", "income", "Freelance / Contract Work", 9000, 20, "Upwork"),
    mk("d5", "expense", "Food & Dining", 1800, 19),
    mk("d6", "income", "Food Delivery (Swiggy/Zomato)", 1900, 16, "Zomato"),
    mk("d7", "expense", "Bills & Utilities", 1500, 15),
    mk("d8", "income", "Ride-hailing (Uber/Ola)", 5300, 13, "Ola"),
    mk("d9", "income", "Home Services (Urban Company)", 3400, 11, "Urban Company"),
    mk("d10", "expense", "Healthcare", 900, 10),
    mk("d11", "income", "Freelance / Contract Work", 900, 7, "Fiverr"),
    mk("d12", "expense", "Fuel & Vehicle", 1950, 6),
    mk("d13", "income", "Food Delivery (Swiggy/Zomato)", 1420, 0, "Swiggy"),
  ];
};
const makeDemoUpcoming = (): UpcomingExpense[] => [
  { id: "up-demo", name: "Bike EMI", amount: 2500, dueDate: shiftDays(5), isEssential: true, isPaid: false },
];

// ─────────────────────────────────────────────────────────────
// Steps 3-5: Financial Data Engine -> Emergency Buffer Engine -> Buffer Status
// ─────────────────────────────────────────────────────────────
// Essential expenses = last-30-day spend in essential categories (scaled up if we have less history),
// falling back to the user's own estimate when nothing is logged yet.
const ESSENTIAL_CATEGORIES = ["Food & Dining", "Fuel & Vehicle", "Bills & Utilities", "Healthcare", "Education"];

function buildBaseline(txns: Txn[], coverageMonths: number, estimate: number | null, currentBuffer: number): Baseline {
  const today = todayISO();

  // Financial Data Engine: average income + volatility
  const amounts = txns.filter((t) => t.type === "income").map((t) => t.amount);
  const avgIncome = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
  const sd = amounts.length
    ? Math.sqrt(amounts.reduce((s, v) => s + Math.pow(v - avgIncome, 2), 0) / amounts.length)
    : 0;
  const volatilityCV = avgIncome > 0 ? (sd / avgIncome) * 100 : 0;
  const hasHistory = amounts.length >= 3 && avgIncome > 0;
  const volatilityLabel = !hasHistory ? "Not enough data" : volatilityCV < 20 ? "Stable" : volatilityCV < 45 ? "Moderate" : "High";
  const suggestedMonths = !hasHistory ? null : volatilityCV < 20 ? 3 : volatilityCV < 45 ? 4 : 6;

  // Financial Data Engine: essential expenses
  const cutoff = shiftDays(-30);
  const essentials = txns.filter((t) => t.type === "expense" && ESSENTIAL_CATEGORIES.includes(t.category) && t.date >= cutoff);
  let logged = 0;
  if (essentials.length) {
    const total = essentials.reduce((s, t) => s + t.amount, 0);
    const earliest = essentials.reduce((m, t) => (t.date < m ? t.date : m), essentials[0].date);
    const spanDays = Math.min(30, Math.max(7, daysBetween(earliest, today) + 1));
    logged = (total * 30) / spanDays;
  }
  const essentialsSource: Baseline["essentialsSource"] = logged > 0 ? "logged" : estimate && estimate > 0 ? "estimate" : "none";
  const monthlyEssential = logged > 0 ? logged : estimate && estimate > 0 ? estimate : 0;

  // Emergency Buffer Engine
  //   Target Buffer   = Essential Monthly Expenses x Selected Coverage Months
  //   Buffer Coverage = Current Buffer / Target Buffer
  const targetBuffer = Math.round(monthlyEssential * coverageMonths);
  const targetKnown = targetBuffer > 0;
  const coveragePct = targetKnown ? (currentBuffer / targetBuffer) * 100 : 0;
  const monthsCovered = monthlyEssential > 0 ? currentBuffer / monthlyEssential : 0;

  // Buffer Status Evaluation
  const status: BufferStatus = !targetKnown ? "low" : coveragePct >= 100 ? "full" : coveragePct >= LOW_BELOW ? "healthy" : "low";

  return {
    avgIncome, volatilityCV, volatilityLabel, hasHistory, suggestedMonths,
    monthlyEssential, essentialsSource, coverageMonths, targetBuffer, targetKnown,
    currentBuffer, coveragePct, monthsCovered, status,
  };
}

// ─────────────────────────────────────────────────────────────
// Steps 6-7: Adaptive Savings Engine + AI Explanation Layer
// ─────────────────────────────────────────────────────────────
function buildPlan(payout: number, b: Baseline, upcoming: UpcomingExpense[], goals: SavingsGoal[]): Plan {
  // Upcoming expenses: unpaid bills due within 14 days (or overdue)
  const horizon = shiftDays(14);
  const due = upcoming.filter((u) => !u.isPaid && u.dueDate <= horizon);
  const upcomingDue = due.reduce((s, u) => s + u.amount, 0);

  // Money this payout must protect: today's share of essentials + today's share of upcoming bills
  const dailyEssential = b.monthlyEssential / 30;
  const cover = dailyEssential + upcomingDue / 14;
  const safeBeforeSaving = payout - cover;

  // Current income vs. usual income
  const ratio = b.hasHistory ? payout / b.avgIncome : null;
  const mult = ratio === null ? 1 : ratio < 0.6 ? 0.5 : ratio < 0.85 ? 0.75 : ratio <= 1.15 ? 1 : ratio <= 1.3 ? 1.25 : 1.5;

  // Savings pool
  const rate = SAVE_RATE[b.status];
  const raw = payout * rate * mult;
  let pool = round10(raw);
  const cap = safeBeforeSaving > 0 ? floor10(safeBeforeSaving * 0.25) : 0;
  const capped = pool > cap;
  if (capped) pool = cap;
  if (pool < 10) pool = 0;

  // Buffer gap + where surplus can go
  const gap = b.targetKnown ? Math.max(0, b.targetBuffer - b.currentBuffer) : Number.POSITIVE_INFINITY;
  const openGoals = goals
    .filter((g) => g.currentAmount < g.targetAmount)
    .sort((a, c) => daysLeft(a.targetDate) - daysLeft(c.targetDate));
  const goal = openGoals[0] ?? null;
  const goalRemaining = goal ? Math.max(0, goal.targetAmount - goal.currentAmount) : 0;

  // Output: recommended emergency buffer contribution (and any share for other goals)
  let bufferAmount = 0;
  let goalAmount = 0;
  if (pool > 0) {
    if (b.status === "full") {
      goalAmount = goal ? Math.min(pool, goalRemaining) : 0;
    } else if (b.status === "healthy" && goal) {
      bufferAmount = Math.min(gap, round10(pool * HEALTHY_BUFFER_SHARE), pool);
      goalAmount = Math.min(pool - bufferAmount, goalRemaining);
    } else {
      bufferAmount = Math.min(pool, gap);
    }
  }
  bufferAmount = Math.round(bufferAmount);
  goalAmount = Math.round(goalAmount);
  const total = bufferAmount + goalAmount;

  // Step 7: explainable recommendation ("why this amount, what influenced it")
  const factors: Factor[] = [];
  if (ratio !== null) {
    const pct = Math.round(Math.abs(ratio - 1) * 100);
    factors.push(
      ratio > 1.15
        ? { label: "Income", effect: "up", detail: `This payout is ${pct}% above your usual ${inr(b.avgIncome)}, so there's more room to save.` }
        : ratio < 0.85
        ? { label: "Income", effect: "down", detail: `This payout is ${pct}% below your usual ${inr(b.avgIncome)}, so the saving is lighter.` }
        : { label: "Income", effect: "neutral", detail: `This payout is in line with your usual ${inr(b.avgIncome)}.` }
    );
  } else {
    factors.push({ label: "Income", effect: "neutral", detail: "Not enough payout history yet to compare this with your usual earnings." });
  }
  factors.push({
    label: "Income volatility",
    effect: b.volatilityLabel === "High" ? "up" : "neutral",
    detail:
      b.volatilityLabel === "Not enough data"
        ? "Log a few more payouts to measure how much your income swings."
        : `${b.volatilityLabel} income swings${b.volatilityLabel === "High" ? ", so a bigger cushion protects you in lean weeks." : "."}`,
  });
  factors.push({
    label: "Essential expenses",
    effect: "neutral",
    detail: b.monthlyEssential > 0 ? `About ${inr(b.monthlyEssential)}/month (${inr(dailyEssential)}/day) is reserved for essentials.` : "No essential expenses on record yet, so nothing is reserved.",
  });
  factors.push({
    label: "Upcoming expenses",
    effect: upcomingDue > 0 ? "down" : "neutral",
    detail: upcomingDue > 0 ? `${inr(upcomingDue)} of bills fall due in the next 2 weeks and are set aside first.` : "No bills due in the next 2 weeks.",
  });
  factors.push({
    label: "Buffer gap",
    effect: b.status === "low" ? "up" : b.status === "healthy" ? "neutral" : "down",
    detail: !b.targetKnown
      ? "Add your monthly essentials in Buffer settings so RupeeMate can size your target."
      : b.status === "full"
      ? `Your buffer is fully funded (${inr(b.currentBuffer)} of ${inr(b.targetBuffer)}), so surplus goes to other goals.`
      : `Your buffer is ${Math.round(b.coveragePct)}% funded, with ${inr(Math.max(0, b.targetBuffer - b.currentBuffer))} still to go.`,
  });

  const phrases: string[] = [];
  if (ratio !== null) phrases.push(ratio > 1.15 ? "your income is above average" : ratio < 0.85 ? "your income is below average, so this is a lighter save" : "your income is in line with average");
  phrases.push(b.status === "low" ? "your emergency buffer is below target" : b.status === "healthy" ? "your buffer is healthy, so savings are shared with your goals" : "your buffer is fully funded, so the surplus goes to your goals");
  if (upcomingDue > 0 && safeBeforeSaving > 0) phrases.push("upcoming expenses are covered");

  let headline: string;
  if (total > 0) {
    headline = `Save ${inr(total)} today because ${joinPhrases(phrases)}.`;
  } else if (safeBeforeSaving <= 0) {
    headline = "Skip saving today because this payout is needed for your essentials and upcoming bills.";
  } else if (b.status === "full" && !goal) {
    headline = "Your buffer is fully funded and there's no open goal to redirect to. Create a goal or explore investing.";
  } else {
    headline = "Skip saving today because this payout is too small to save from safely.";
  }

  let why = `${inr(payout)} × ${Math.round(rate * 100)}% (${STATUS_META[b.status].label.toLowerCase()}) × ${mult} for income vs. average = ${inr(raw)}.`;
  if (capped) why += ` Limited to ${inr(cap)}, which is 25% of the ${inr(Math.max(0, safeBeforeSaving))} left after essentials and bills.`;
  if (b.status !== "full" && b.targetKnown && bufferAmount >= gap && gap > 0) why += " The buffer amount is limited to what's left to reach your target.";

  return {
    payout, payoutVsAvg: ratio, dailyEssential, upcomingDue, upcomingCount: due.length, cover, safeBeforeSaving,
    status: b.status, bufferAmount, goalAmount, goalId: goal?.id ?? null,
    headline, why, factors,
  };
}

// ─────────────────────────────────────────────────────────────
// UI pieces
// ─────────────────────────────────────────────────────────────
function StepHeading({ n, title, note }: { n: number; title: string; note?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full border border-[#B8860B] text-[#B8860B] text-xs font-medium flex items-center justify-center font-sans shrink-0">
          {n}
        </span>
        <h3 className="font-serif text-xl text-[#1B2B44]">{title}</h3>
      </div>
      {note && <p className="text-sm text-[#5B5540] mt-1.5 ml-9">{note}</p>}
    </div>
  );
}

function GoalJar({ percent, color }: { percent: number; color: string }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const fillY = 56 - (clamped / 100) * 56;
  const id = `jar-${color.replace("#", "")}`;
  return (
    <svg viewBox="0 0 48 64" className="w-12 h-16 shrink-0" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <path d="M6 8 h36 v46 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 z" />
        </clipPath>
      </defs>
      <path d="M6 8 h36 v46 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 z" fill="#F7F3E9" stroke="#D9D0B8" strokeWidth="1.5" />
      <rect x="16" y="2" width="16" height="7" rx="2" fill="#D9D0B8" />
      <g clipPath={`url(#${id})`}>
        <rect x="4" y={8 + fillY} width="40" height={56 - fillY} fill={color} opacity="0.85" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function SavingsGoalsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState("");
  const [busy, setBusy] = useState(false);

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingExpense[]>([]);
  const [savingsTxns, setSavingsTxns] = useState<SavingsTxn[]>([]);
  const [resolvedTxnIds, setResolvedTxnIds] = useState<Set<string>>(new Set());

  // Step 1 preferences + buffer balance (saved values)
  const [coverageMonths, setCoverageMonths] = useState(3);
  const [essentialsEstimate, setEssentialsEstimate] = useState<number | null>(null);
  const [bufferBalance, setBufferBalance] = useState(0);
  // Buffer settings form (edited values)
  const [fMonths, setFMonths] = useState("3");
  const [fBalance, setFBalance] = useState("0");
  const [fEstimate, setFEstimate] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");

  // Payout + decision state
  const [payoutChoice, setPayoutChoice] = useState(""); // "" = latest unallocated, "manual", or a txn id
  const [manualPayout, setManualPayout] = useState("");
  const [modifying, setModifying] = useState(false);
  const [bufferInput, setBufferInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [goalOverride, setGoalOverride] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState("");
  const [aiText, setAiText] = useState<string | null>(null);
  const [lastAllocation, setLastAllocation] = useState<{ safe: number } | null>(null);

  // Goal form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Vehicle & Equipment");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");

  // Upcoming-expense form
  const [upName, setUpName] = useState("");
  const [upAmount, setUpAmount] = useState("");
  const [upDate, setUpDate] = useState("");

  // ── Data loading (Step 2: data collection) ──
  const applyDemo = useCallback(() => {
    setGoals(defaultGoals);
    setTxns(makeDemoTxns());
    setUpcoming(makeDemoUpcoming());
    setSavingsTxns([]);
    setResolvedTxnIds(new Set());
    setCoverageMonths(3);
    setEssentialsEstimate(null);
    setBufferBalance(8500);
    setFMonths("3");
    setFBalance("8500");
    setFEstimate("");
    setIsDemo(true);
  }, []);

  const loadLedger = useCallback(async (uid: string) => {
    const res = await runWithRefresh(() =>
      db("savings_transactions").select("id,destination,goal_id,amount,created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(30)
    );
    if (!res.error) setSavingsTxns((res.data ?? []).map(mapSavingsTxn));
  }, []);

  const loadAll = useCallback(
    async (uid: string) => {
      const goalsRes = await runWithRefresh(() =>
        db("savings_goals").select("*").eq("user_id", uid).order("created_at", { ascending: true })
      );

      if (goalsRes.error && isJwtError(goalsRes.error)) {
        await supabase.auth.signOut({ scope: "local" });
        setUserId(null);
        setSyncError("Your session expired. Please sign in again to load your saved goals.");
        applyDemo();
        return;
      }
      if (goalsRes.error) {
        setSyncError(
          isMissingTable(goalsRes.error)
            ? "Goal tables aren't set up yet. Run emergency_buffer_workflow.sql in Supabase, then refresh. Showing demo data meanwhile."
            : `Could not load your goals (${goalsRes.error.message}). Showing demo data instead.`
        );
        applyDemo();
        return;
      }

      const [upRes, txRes, recRes, balRes, prefRes, ledgerRes] = await Promise.all([
        runWithRefresh(() => db("upcoming_expenses").select("*").eq("user_id", uid).order("due_date", { ascending: true })),
        runWithRefresh(() =>
          db("transactions").select("id,type,category,amount,date,source").eq("user_id", uid).gte("date", shiftDays(-90)).order("date", { ascending: false })
        ),
        runWithRefresh(() => db("ai_recommendations").select("income_txn_id").eq("user_id", uid).not("income_txn_id", "is", null)),
        runWithRefresh(() => db("emergency_buffer_balance").select("balance").eq("user_id", uid).maybeSingle()),
        runWithRefresh(() => db("user_preferences").select("buffer_coverage_months,monthly_essentials_estimate").eq("user_id", uid).maybeSingle()),
        runWithRefresh(() =>
          db("savings_transactions").select("id,destination,goal_id,amount,created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(30)
        ),
      ]);

      setGoals((goalsRes.data ?? []).map(mapGoal));
      setUpcoming(upRes.error ? [] : (upRes.data ?? []).map(mapUpcoming));
      setTxns(txRes.error ? [] : (txRes.data ?? []).map(mapTxn));
      setResolvedTxnIds(new Set(recRes.error ? [] : (recRes.data ?? []).map((r: any) => r.income_txn_id as string)));
      setSavingsTxns(ledgerRes.error ? [] : (ledgerRes.data ?? []).map(mapSavingsTxn));

      const bal = balRes.error ? 0 : Number(balRes.data?.balance ?? 0);
      const months = prefRes.error || !prefRes.data ? 3 : Number(prefRes.data.buffer_coverage_months);
      const est = prefRes.error || !prefRes.data || prefRes.data.monthly_essentials_estimate == null ? null : Number(prefRes.data.monthly_essentials_estimate);
      setBufferBalance(bal);
      setCoverageMonths(months);
      setEssentialsEstimate(est);
      setFMonths(String(months));
      setFBalance(String(bal));
      setFEstimate(est == null ? "" : String(est));

      const firstErr = upRes.error || txRes.error || recRes.error || balRes.error || prefRes.error || ledgerRes.error;
      setSyncError(
        firstErr
          ? isMissingTable(firstErr)
            ? "Some tables are missing. Run emergency_buffer_workflow.sql in Supabase, then refresh."
            : `Some data couldn't be loaded (${firstErr.message}).`
          : ""
      );
      setIsDemo(false);
    },
    [applyDemo]
  );

  useEffect(() => {
    let cancelled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Don't await other supabase calls directly in this callback (auth-lock deadlock); defer instead.
      setTimeout(async () => {
        if (cancelled) return;
        if (session?.user) {
          setUserId(session.user.id);
          if (event === "INITIAL_SESSION" || event === "SIGNED_IN") setLoading(true);
          await loadAll(session.user.id);
          if (!cancelled) setLoading(false);
        } else {
          setUserId(null);
          applyDemo();
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadAll, applyDemo]);

  const persisted = !isDemo && !!userId;

  // ── Buffer settings (Step 1: emergency buffer preference) ──
  const saveSettings = async () => {
    const months = Math.min(12, Math.max(1, Number(fMonths) || 3));
    const balance = Math.max(0, Number(fBalance) || 0);
    const est = fEstimate === "" ? null : Math.max(0, Number(fEstimate) || 0);
    setSettingsMsg("");

    if (persisted) {
      setBusy(true);
      const p = await runWithRefresh(() =>
        db("user_preferences").upsert({ user_id: userId, buffer_coverage_months: months, monthly_essentials_estimate: est }, { onConflict: "user_id" })
      );
      let b: { error: any } = { error: null };
      if (!p.error && balance !== bufferBalance) {
        b = await runWithRefresh(() => db("emergency_buffer_balance").upsert({ user_id: userId, balance }, { onConflict: "user_id" }));
      }
      setBusy(false);
      const err = p.error || b.error;
      if (err) {
        setSyncError(`Couldn't save your buffer settings (${err.message}).`);
        return;
      }
      setSyncError("");
    }
    setCoverageMonths(months);
    setEssentialsEstimate(est);
    setBufferBalance(balance);
    setFMonths(String(months));
    setFBalance(String(balance));
    setSettingsMsg(persisted ? "Saved." : "Applied for this session (sign in to keep it).");
  };

  // ── Goals CRUD ──
  const resetForm = () => {
    setName("");
    setCategory("Vehicle & Equipment");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
    setNotes("");
  };

  const addGoal = async () => {
    if (!name || !targetAmount || !targetDate) return;
    const draft: SavingsGoal = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `goal-${Date.now()}`,
      name,
      category,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate,
      autoSaveEnabled: false,
      autoSaveAmount: 0,
      autoSaveFrequency: "daily",
      notes: notes || undefined,
    };

    if (!persisted) {
      setGoals((prev) => [...prev, draft]);
    } else {
      setBusy(true);
      const { data, error } = await runWithRefresh(() =>
        db("savings_goals")
          .insert([
            {
              user_id: userId,
              name: draft.name,
              category: draft.category,
              target_amount: draft.targetAmount,
              current_amount: draft.currentAmount,
              target_date: draft.targetDate,
              auto_save_enabled: false,
              auto_save_amount: 0,
              auto_save_frequency: "daily",
              notes: draft.notes ?? null,
            },
          ])
          .select()
          .single()
      );
      setBusy(false);
      if (error) {
        setSyncError(`Couldn't create that goal (${error.message}).`);
        return;
      }
      setSyncError("");
      setGoals((prev) => [...prev, mapGoal(data)]);
    }
    resetForm();
    setShowForm(false);
  };

  const deleteGoal = async (id: string) => {
    if (persisted) {
      const { error } = await runWithRefresh(() => db("savings_goals").delete().eq("id", id).eq("user_id", userId));
      if (error) {
        setSyncError(`Couldn't delete that goal (${error.message}).`);
        return;
      }
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // ── Upcoming expenses CRUD ──
  const addUpcoming = async () => {
    const amt = Number(upAmount);
    if (!upName.trim() || !amt || amt <= 0 || !upDate) return;
    if (!persisted) {
      setUpcoming((prev) =>
        [...prev, { id: `up-${Date.now()}`, name: upName.trim(), amount: amt, dueDate: upDate, isEssential: true, isPaid: false }].sort((a, b) =>
          a.dueDate.localeCompare(b.dueDate)
        )
      );
    } else {
      const { data, error } = await runWithRefresh(() =>
        db("upcoming_expenses").insert([{ user_id: userId, name: upName.trim(), amount: amt, due_date: upDate, is_essential: true }]).select().single()
      );
      if (error) {
        setSyncError(`Couldn't add that expense (${error.message}).`);
        return;
      }
      setUpcoming((prev) => [...prev, mapUpcoming(data)].sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
    }
    setUpName("");
    setUpAmount("");
    setUpDate("");
  };

  const markUpcomingPaid = async (id: string) => {
    if (persisted) {
      const { error } = await runWithRefresh(() => db("upcoming_expenses").update({ is_paid: true }).eq("id", id).eq("user_id", userId));
      if (error) {
        setSyncError(`Couldn't update that expense (${error.message}).`);
        return;
      }
    }
    setUpcoming((prev) => prev.map((u) => (u.id === id ? { ...u, isPaid: true } : u)));
  };

  const deleteUpcoming = async (id: string) => {
    if (persisted) {
      const { error } = await runWithRefresh(() => db("upcoming_expenses").delete().eq("id", id).eq("user_id", userId));
      if (error) {
        setSyncError(`Couldn't delete that expense (${error.message}).`);
        return;
      }
    }
    setUpcoming((prev) => prev.filter((u) => u.id !== id));
  };

  // ── Engines ──
  const baseline = useMemo(
    () => buildBaseline(txns, coverageMonths, essentialsEstimate, bufferBalance),
    [txns, coverageMonths, essentialsEstimate, bufferBalance]
  );

  const payoutOptions = useMemo(
    () =>
      txns
        .filter((t) => t.type === "income" && !resolvedTxnIds.has(t.id))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    [txns, resolvedTxnIds]
  );
  const effectiveChoice = payoutChoice || (payoutOptions[0]?.id ?? "manual");
  const selectedTxn = payoutOptions.find((t) => t.id === effectiveChoice);
  const payoutValue = selectedTxn ? selectedTxn.amount : Number(manualPayout) || 0;

  const plan = useMemo(
    () => (payoutValue > 0 ? buildPlan(payoutValue, baseline, upcoming, goals) : null),
    [payoutValue, baseline, upcoming, goals]
  );

  // Optional AI-written explanation
  const planKey = plan ? `${plan.payout}|${plan.status}|${plan.bufferAmount}|${plan.goalAmount}` : "";
  useEffect(() => {
    setAiText(null);
    if (!AI_EXPLAIN_ENDPOINT || !plan) return;
    const ctrl = new AbortController();
    fetch(AI_EXPLAIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, baseline }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.explanation) setAiText(String(j.explanation));
      })
      .catch(() => {});
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planKey]);

  // ── Step 8: user decision (accept or modify) ──
  const effGoalId = goalOverride !== null ? goalOverride : plan?.goalId ?? "";
  const effGoal = goals.find((g) => g.id === effGoalId) ?? null;
  const goalRemaining = effGoal ? Math.max(0, effGoal.targetAmount - effGoal.currentAmount) : 0;
  const bufferAmt = modifying && bufferInput !== "" ? Math.max(0, Number(bufferInput) || 0) : plan?.bufferAmount ?? 0;
  const goalAmtRaw = modifying && goalInput !== "" ? Math.max(0, Number(goalInput) || 0) : plan?.goalAmount ?? 0;
  const goalAmt = effGoal ? Math.min(goalAmtRaw, goalRemaining) : 0;
  const totalToSave = bufferAmt + goalAmt;
  const changed = !!plan && (bufferAmt !== plan.bufferAmount || goalAmt !== plan.goalAmount || (goalAmt > 0 && effGoalId !== (plan.goalId ?? "")));

  const resetDecision = () => {
    setPayoutChoice("");
    setManualPayout("");
    setModifying(false);
    setBufferInput("");
    setGoalInput("");
    setGoalOverride(null);
  };

  const accept = async () => {
    if (!plan || totalToSave <= 0) return;
    const explanation = aiText ?? plan.headline;
    setBusy(true);
    setResultMsg("");
    try {
      if (!persisted) {
        setBufferBalance((v) => v + bufferAmt);
        setFBalance((v) => String((Number(v) || 0) + bufferAmt));
        if (goalAmt > 0 && effGoal) {
          setGoals((prev) => prev.map((g) => (g.id === effGoal.id ? { ...g, currentAmount: g.currentAmount + goalAmt } : g)));
        }
        const now = new Date().toISOString();
        setSavingsTxns((prev) => [
          ...(goalAmt > 0 && effGoal ? [{ id: `l-${Date.now()}-g`, destination: "goal" as const, goalId: effGoal.id, amount: goalAmt, createdAt: now }] : []),
          ...(bufferAmt > 0 ? [{ id: `l-${Date.now()}-b`, destination: "emergency_buffer" as const, goalId: null, amount: bufferAmt, createdAt: now }] : []),
          ...prev,
        ]);
        if (selectedTxn) setResolvedTxnIds((prev) => new Set(prev).add(selectedTxn.id));
      } else {
        const { data, error } = await runWithRefresh(() =>
          rpc("apply_savings_recommendation", {
            p_income_txn_id: selectedTxn?.id ?? null,
            p_payout_amount: plan.payout,
            p_buffer_status: plan.status,
            p_suggested_buffer: plan.bufferAmount,
            p_suggested_goal: plan.goalAmount,
            p_buffer_amount: bufferAmt,
            p_goal_id: goalAmt > 0 ? effGoalId : null,
            p_goal_amount: goalAmt,
            p_status: changed ? "modified" : "accepted",
            p_explanation: explanation,
            p_factors: plan.factors,
          })
        );
        if (error) throw error;
        const newBalance = Number(data?.buffer_balance ?? bufferBalance + bufferAmt);
        setBufferBalance(newBalance);
        setFBalance(String(newBalance));
        if (data?.goal) {
          const g = mapGoal(data.goal);
          setGoals((prev) => prev.map((x) => (x.id === g.id ? g : x)));
        }
        if (selectedTxn) setResolvedTxnIds((prev) => new Set(prev).add(selectedTxn.id));
        await loadLedger(userId as string);
      }
      setLastAllocation({ safe: plan.payout - totalToSave - plan.cover });
      setSyncError("");
      setResultMsg(
        `Done. ${bufferAmt > 0 ? `${inr(bufferAmt)} added to your emergency buffer` : ""}${bufferAmt > 0 && goalAmt > 0 ? " and " : ""}${
          goalAmt > 0 && effGoal ? `${inr(goalAmt)} added to ${effGoal.name}` : ""
        }.`
      );
      resetDecision();
    } catch (e: any) {
      setSyncError(`Couldn't save that (${e?.message ?? "unknown error"}). Nothing was changed.`);
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    if (!plan) return;
    if (persisted && selectedTxn) {
      setBusy(true);
      const { error } = await runWithRefresh(() =>
        db("ai_recommendations").insert([
          {
            user_id: userId,
            income_txn_id: selectedTxn.id,
            payout_amount: plan.payout,
            suggested_buffer: plan.bufferAmount,
            suggested_goal: plan.goalAmount,
            final_buffer: 0,
            final_goal: 0,
            goal_id: plan.goalId,
            buffer_status: plan.status,
            status: "skipped",
            explanation: aiText ?? plan.headline,
            factors: plan.factors,
          },
        ])
      );
      setBusy(false);
      if (error) {
        setSyncError(`Couldn't skip that payout (${error.message}).`);
        return;
      }
      setResolvedTxnIds((prev) => new Set(prev).add(selectedTxn.id));
    } else if (selectedTxn) {
      setResolvedTxnIds((prev) => new Set(prev).add(selectedTxn.id));
    }
    setLastAllocation({ safe: plan.payout - plan.cover });
    setResultMsg("Skipped. Keep this payout for expenses.");
    resetDecision();
  };

  // ── Step 10: dashboard numbers ──
  const todayStr = todayISO();
  const todayBuffer = savingsTxns.filter((t) => t.destination === "emergency_buffer" && toISO(new Date(t.createdAt)) === todayStr).reduce((s, t) => s + t.amount, 0);
  const todayGoals = savingsTxns.filter((t) => t.destination === "goal" && toISO(new Date(t.createdAt)) === todayStr).reduce((s, t) => s + t.amount, 0);
  const previewSafe = plan ? plan.payout - totalToSave - plan.cover : null;
  const safeValue = previewSafe ?? lastAllocation?.safe ?? null;
  const progressPct = baseline.targetKnown ? Math.min(100, baseline.coveragePct) : 0;
  const statusMeta = STATUS_META[baseline.status];

  const nearestGoal = useMemo(() => {
    const unfinished = goals.filter((g) => g.currentAmount < g.targetAmount);
    return unfinished.length ? [...unfinished].sort((a, b) => daysLeft(a.targetDate) - daysLeft(b.targetDate))[0] : null;
  }, [goals]);

  return (
    <main className="min-h-screen bg-[#F7F3E9] text-[#1B2B44] pt-20 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Folder-tab header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#1B2B44] text-[#F7F3E9] px-4 py-1.5 rounded-t-md text-xs tracking-wide font-medium">
            <PiggyBank size={14} />
            Savings Goals
          </div>
          <div className={`${card} rounded-tl-none px-8 py-8 shadow-sm`}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl text-[#1B2B44] leading-tight">Your safety net, sized to your real life</h1>
                <p className="text-[#5B5540] mt-3 max-w-xl text-[15px] leading-relaxed">
                  Every payout is checked against your earning pattern, essentials, upcoming bills and emergency buffer.
                  You get one clear suggestion, the reasons behind it, and the final say.
                </p>
              </div>
              <button onClick={() => setShowForm(!showForm)} className={`${primaryBtn} whitespace-nowrap`}>
                <Plus size={17} />
                New goal
              </button>
            </div>
          </div>
        </div>

        {isDemo && (
          <div className="mb-6 flex items-center gap-2 rounded-md border border-[#D9C58A] bg-[#F5EBD0] px-4 py-3 text-sm text-[#7A5A0A]">
            <AlertTriangle size={16} className="shrink-0" />
            {userId
              ? "Couldn't load your saved data, so this is sample data and changes won't be saved."
              : "You're not signed in, so this is sample data and changes won't be saved. Sign in to keep your goals and buffer."}
          </div>
        )}
        {syncError && (
          <div className="mb-6 flex items-center gap-2 rounded-md border border-[#A6432D]/40 bg-[#FBEDE8] px-4 py-3 text-sm text-[#A6432D]">
            <AlertTriangle size={16} className="shrink-0" /> {syncError}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-[#5B5540]">
            <Loader2 size={22} className="animate-spin" /> Loading your buffer…
          </div>
        ) : (
          <>
            {/* Step 10: Financial dashboard, as a ledger summary strip */}
            <div className={`${card} mb-10 divide-y divide-[#D9D0B8]`}>
              <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D9D0B8]">
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Current buffer</p>
                  <p className="font-serif text-3xl tabular-nums">{inr(baseline.currentBuffer)}</p>
                  <p className="text-sm text-[#8A8371] mt-1">emergency savings on hand</p>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Target buffer</p>
                  <p className="font-serif text-3xl tabular-nums">{baseline.targetKnown ? inr(baseline.targetBuffer) : "—"}</p>
                  <p className="text-sm text-[#8A8371] mt-1">
                    {baseline.targetKnown ? `${inr(baseline.monthlyEssential)}/mo × ${baseline.coverageMonths} months` : "Add your monthly essentials in Buffer settings"}
                  </p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase tracking-wide text-[#8A8371]">Buffer progress</p>
                    <Stamp size={14} className="text-[#B8860B]" />
                  </div>
                  <p className="font-serif text-3xl tabular-nums">{baseline.targetKnown ? `${Math.round(baseline.coveragePct)}%` : "—"}</p>
                  <div className="h-1.5 bg-[#EFE9D8] rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: statusMeta.color }} />
                  </div>
                  <p className="text-xs font-medium mt-1.5" style={{ color: statusMeta.color }}>
                    {baseline.targetKnown ? statusMeta.label : "Target not set"}
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#D9D0B8]">
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Months of expense coverage</p>
                  <p className="font-serif text-3xl tabular-nums">{baseline.monthlyEssential > 0 ? baseline.monthsCovered.toFixed(1) : "—"}</p>
                  <p className="text-sm text-[#8A8371] mt-1">of {baseline.coverageMonths} months targeted</p>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Today&apos;s contribution</p>
                  <p className="font-serif text-3xl tabular-nums">{inr(todayBuffer)}</p>
                  <p className="text-sm text-[#8A8371] mt-1">to buffer{todayGoals > 0 ? ` · ${inr(todayGoals)} to goals` : ""}</p>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Safe to spend</p>
                  <p className="font-serif text-3xl tabular-nums text-[#3F6B4D]">{safeValue === null ? "—" : inr(Math.max(0, safeValue))}</p>
                  <p className="text-sm text-[#8A8371] mt-1">
                    {previewSafe !== null ? "from this payout after saving & bills (preview)" : lastAllocation ? "left from your last payout after saving & bills" : "pick a payout to see this"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-10">
              {/* ───────── Main flow ───────── */}
              <div className={`lg:col-span-2 ${card} p-6 md:p-8`}>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={18} className="text-[#B8860B]" />
                  <h2 className="font-serif text-2xl">Intelligent emergency buffer</h2>
                </div>
                <p className="text-sm text-[#5B5540] mb-8">Follow the steps below. Nothing is saved until you accept.</p>

                {resultMsg && (
                  <div className="mb-8 flex items-start gap-2 rounded-md border border-[#3F6B4D]/40 bg-[#EBF2EC] px-4 py-3 text-sm text-[#3F6B4D]">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> {resultMsg}
                  </div>
                )}

                {/* 1. Payout */}
                <StepHeading n={1} title="Payout received" note="Choose a recent income entry from your Money Manager, or type an amount." />
                <div className="grid md:grid-cols-2 gap-3 mb-8">
                  <select
                    value={effectiveChoice}
                    onChange={(e) => {
                      setPayoutChoice(e.target.value);
                      setModifying(false);
                      setBufferInput("");
                      setGoalInput("");
                      setGoalOverride(null);
                      setResultMsg("");
                    }}
                    className={inputClass}
                  >
                    {payoutOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {inr(t.amount)} · {t.source || t.category} · {t.date}
                      </option>
                    ))}
                    <option value="manual">Enter an amount manually</option>
                  </select>
                  {effectiveChoice === "manual" && (
                    <input
                      type="number"
                      min="0"
                      value={manualPayout}
                      onChange={(e) => {
                        setManualPayout(e.target.value);
                        setResultMsg("");
                      }}
                      placeholder="Payout received, e.g. 1420"
                      className={inputClass}
                    />
                  )}
                </div>

                {!plan || payoutValue <= 0 ? (
                  <div className="rounded-md border border-dashed border-[#D9D0B8] p-8 text-center text-sm text-[#8A8371]">
                    {payoutOptions.length === 0 ? "No new payouts to allocate. Enter an amount above, or log income in the Money Manager." : "Enter a payout amount to see the analysis."}
                  </div>
                ) : (
                  <>
                    {/* 2. Financial picture */}
                    <StepHeading n={2} title="Your financial picture" note="Average income, volatility, essential expenses and upcoming bills." />
                    <div className="grid sm:grid-cols-3 gap-3 mb-8">
                      <div className="rounded-md bg-[#F7F3E9] border border-[#E7E0CC] p-4">
                        <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-1">Income pattern</p>
                        <p className="font-serif text-xl tabular-nums">{baseline.avgIncome > 0 ? inr(baseline.avgIncome) : "—"}</p>
                        <p className="text-xs text-[#8A8371] mt-1">
                          average payout · {baseline.volatilityLabel}
                          {plan.payoutVsAvg !== null && ` · this one is ${Math.round(plan.payoutVsAvg * 100)}% of average`}
                        </p>
                      </div>
                      <div className="rounded-md bg-[#F7F3E9] border border-[#E7E0CC] p-4">
                        <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-1">Essential expenses</p>
                        <p className="font-serif text-xl tabular-nums">{baseline.monthlyEssential > 0 ? inr(baseline.monthlyEssential) : "—"}</p>
                        <p className="text-xs text-[#8A8371] mt-1">
                          per month{plan.dailyEssential > 0 ? ` · about ${inr(plan.dailyEssential)}/day` : ""}
                          {baseline.essentialsSource === "estimate" ? " · your estimate" : ""}
                        </p>
                      </div>
                      <div className="rounded-md bg-[#F7F3E9] border border-[#E7E0CC] p-4">
                        <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-1">Upcoming (14 days)</p>
                        <p className="font-serif text-xl tabular-nums">{inr(plan.upcomingDue)}</p>
                        <p className="text-xs text-[#8A8371] mt-1">{plan.upcomingCount} bill(s) due</p>
                      </div>
                    </div>

                    {/* 3. Buffer target, coverage and status */}
                    <StepHeading n={3} title="Emergency buffer status" />
                    <div className="rounded-md border border-[#E7E0CC] p-4 mb-3">
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                        <p className="text-[#5B5540]">
                          <span className="text-[#8A8371]">Target buffer = </span>
                          {baseline.targetKnown ? `${inr(baseline.monthlyEssential)} × ${baseline.coverageMonths} months = ` : ""}
                          <span className="font-medium text-[#1B2B44]">{baseline.targetKnown ? inr(baseline.targetBuffer) : "not set yet"}</span>
                        </p>
                        <p className="text-[#5B5540]">
                          <span className="text-[#8A8371]">Buffer coverage = </span>
                          {baseline.targetKnown ? `${inr(baseline.currentBuffer)} ÷ ${inr(baseline.targetBuffer)} = ` : ""}
                          <span className="font-medium text-[#1B2B44]">{baseline.targetKnown ? `${Math.round(baseline.coveragePct)}%` : "—"}</span>
                        </p>
                      </div>
                      <div className="h-2 bg-[#EFE9D8] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: statusMeta.color }} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 mb-2">
                      {(["low", "healthy", "full"] as BufferStatus[]).map((s) => {
                        const meta = STATUS_META[s];
                        const Icon = meta.icon;
                        const active = baseline.status === s;
                        return (
                          <div key={s} className={`rounded-md border p-3 transition-colors ${active ? "border-[#1B2B44] bg-[#F7F3E9]" : "border-[#E7E0CC] opacity-55"}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Icon size={15} style={{ color: meta.color }} />
                              <p className="text-sm font-medium">{meta.label}</p>
                            </div>
                            <p className="text-xs text-[#8A8371] mb-1">{meta.range}</p>
                            <p className="text-xs text-[#5B5540]">{meta.action}</p>
                          </div>
                        );
                      })}
                    </div>
                    {baseline.status === "full" && (
                      <p className="text-sm mb-2">
                        <Link href="/calculators/sip" className="text-[#B8860B] font-medium hover:underline">
                          Explore investing with the SIP calculator →
                        </Link>
                      </p>
                    )}
                    <div className="mb-8" />

                    {/* 4. Recommendation + explanation */}
                    <StepHeading n={4} title="Recommended contribution" note="Adaptive savings engine plus a plain-language explanation." />
                    <div className="rounded-md bg-[#1B2B44] text-[#F7F3E9] p-6 mb-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-[#D9C58A] mb-3">
                        <Sparkles size={13} />
                        Explainable recommendation
                      </div>
                      <p className="font-serif text-xl leading-snug">&ldquo;{aiText ?? plan.headline}&rdquo;</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      <div className="rounded-md border border-[#E7E0CC] p-4">
                        <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Why this amount?</p>
                        <p className="text-sm text-[#4A4433] leading-relaxed">{plan.why}</p>
                      </div>
                      <div className="rounded-md border border-[#E7E0CC] p-4">
                        <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">What factors influenced it?</p>
                        <ul className="space-y-1.5">
                          {plan.factors.map((f) => (
                            <li key={f.label} className="text-sm text-[#4A4433] border-l-2 pl-3 py-0.5" style={{ borderColor: f.effect === "up" ? "#3F6B4D" : f.effect === "down" ? "#A6432D" : "#D9D0B8" }}>
                              <span className="font-medium">{f.label}:</span> {f.detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 5. Decision */}
                    <StepHeading n={5} title="Your decision" note="Accept the suggestion, or modify the amounts first." />
                    <div className="rounded-md border border-[#E7E0CC] p-4 mb-4">
                      {modifying ? (
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-[#5B5540] mb-1.5">To emergency buffer (₹)</label>
                            <input type="number" min="0" value={bufferInput !== "" ? bufferInput : plan.bufferAmount || ""} onChange={(e) => setBufferInput(e.target.value)} placeholder="0" className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#5B5540] mb-1.5">Goal</label>
                            <select value={effGoalId} onChange={(e) => setGoalOverride(e.target.value)} className={inputClass}>
                              <option value="">No goal</option>
                              {goals.map((g) => (
                                <option key={g.id} value={g.id}>
                                  {g.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#5B5540] mb-1.5">To goal (₹)</label>
                            <input type="number" min="0" disabled={!effGoal} value={goalInput !== "" ? goalInput : plan.goalAmount || ""} onChange={(e) => setGoalInput(e.target.value)} placeholder="0" className={`${inputClass} disabled:opacity-50`} />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-baseline justify-between">
                            <span className="font-serif text-lg">Emergency buffer</span>
                            <span className="flex-1 border-b border-dotted border-[#C9BF9F] mx-3" />
                            <span className="font-serif text-lg tabular-nums">{inr(bufferAmt)}</span>
                          </div>
                          {(goalAmt > 0 || plan.goalAmount > 0) && (
                            <div className="flex items-baseline justify-between">
                              <span className="font-serif text-lg truncate">{effGoal?.name ?? "Other goals"}</span>
                              <span className="flex-1 border-b border-dotted border-[#C9BF9F] mx-3" />
                              <span className="font-serif text-lg tabular-nums">{inr(goalAmt)}</span>
                            </div>
                          )}
                          {totalToSave === 0 && <p className="text-sm text-[#8A8371]">Nothing to save from this payout.</p>}
                        </div>
                      )}
                      {effGoal && goalAmtRaw > goalRemaining && (
                        <p className="text-xs text-[#7A5A0A] mt-3">Only {inr(goalRemaining)} is left to reach {effGoal.name}, so that&apos;s the most that can be added.</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button onClick={accept} disabled={busy || totalToSave <= 0} className={primaryBtn}>
                        {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        {changed ? `Save modified ${inr(totalToSave)}` : totalToSave > 0 ? `Accept · save ${inr(totalToSave)}` : "Accept recommendation"}
                      </button>
                      <button
                        onClick={() => {
                          setModifying(!modifying);
                          setBufferInput("");
                          setGoalInput("");
                        }}
                        disabled={busy}
                        className={ghostBtn}
                      >
                        <Pencil size={15} />
                        {modifying ? "Use suggestion" : "Modify amount"}
                      </button>
                      <button onClick={skip} disabled={busy} className="px-3 py-3 text-sm text-[#8A8371] hover:text-[#1B2B44] transition-colors">
                        Skip this payout
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* ───────── Right column ───────── */}
              <div className="space-y-6">
                {/* Buffer settings (Step 1 preference) */}
                <div className={`${card} p-6`}>
                  <h2 className="font-serif text-xl mb-1">Buffer settings</h2>
                  <p className="text-sm text-[#5B5540] mb-4">How many months of essentials do you want covered?</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5B5540] mb-1.5">Coverage months</label>
                      <select value={fMonths} onChange={(e) => setFMonths(e.target.value)} className={inputClass}>
                        {COVERAGE_OPTIONS.map((m) => (
                          <option key={m} value={m}>
                            {m} month{m > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      {baseline.suggestedMonths !== null && baseline.suggestedMonths !== Number(fMonths) && (
                        <p className="text-xs text-[#7A5A0A] mt-1.5">
                          Your income is {baseline.volatilityLabel.toLowerCase()}, so {baseline.suggestedMonths} months is a good fit.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5B5540] mb-1.5">Current buffer balance (₹)</label>
                      <input type="number" min="0" value={fBalance} onChange={(e) => setFBalance(e.target.value)} className={inputClass} />
                      <p className="text-xs text-[#8A8371] mt-1">Include savings you already have set aside.</p>
                    </div>
                    {baseline.essentialsSource !== "logged" && (
                      <div>
                        <label className="block text-xs font-medium text-[#5B5540] mb-1.5">Monthly essentials estimate (₹)</label>
                        <input type="number" min="0" value={fEstimate} onChange={(e) => setFEstimate(e.target.value)} placeholder="Rent, food, fuel, bills…" className={inputClass} />
                        <p className="text-xs text-[#8A8371] mt-1">Used until you log essential expenses in the Money Manager.</p>
                      </div>
                    )}
                    <button onClick={saveSettings} disabled={busy} className={`${ghostBtn} w-full`}>
                      Save settings
                    </button>
                    {settingsMsg && <p className="text-xs text-[#3F6B4D]">{settingsMsg}</p>}
                  </div>
                </div>

                {/* Upcoming expenses */}
                <div className={`${card} p-6`}>
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarClock size={17} className="text-[#B8860B]" />
                    <h2 className="font-serif text-xl">Upcoming expenses</h2>
                  </div>
                  <p className="text-sm text-[#5B5540] mb-4">Rent, EMIs, recharges. These are protected before any saving is suggested.</p>
                  <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
                    {upcoming.filter((u) => !u.isPaid).length === 0 && <p className="text-sm text-[#8A8371]">Nothing coming up.</p>}
                    {upcoming
                      .filter((u) => !u.isPaid)
                      .map((u) => {
                        const overdue = u.dueDate < todayISO();
                        return (
                          <div key={u.id} className="flex items-center justify-between gap-2 rounded-md bg-[#F7F3E9] border border-[#E7E0CC] px-3 py-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{u.name}</p>
                              <p className={`text-xs ${overdue ? "text-[#A6432D]" : "text-[#8A8371]"}`}>
                                {overdue ? "Overdue · " : "Due "}
                                {u.dueDate}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-medium tabular-nums">{inr(u.amount)}</span>
                              <button onClick={() => markUpcomingPaid(u.id)} title="Mark paid" className="text-[#3F6B4D] hover:opacity-70">
                                <Check size={16} />
                              </button>
                              <button onClick={() => deleteUpcoming(u.id)} title="Delete" className="text-[#A6432D] hover:text-[#7E3120]">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="space-y-2">
                    <input value={upName} onChange={(e) => setUpName(e.target.value)} placeholder="e.g. Bike EMI" className={inputClass} />
                    <div className="flex gap-2">
                      <input type="number" min="0" value={upAmount} onChange={(e) => setUpAmount(e.target.value)} placeholder="Amount" className={inputClass} />
                      <input type="date" value={upDate} onChange={(e) => setUpDate(e.target.value)} className={inputClass} />
                    </div>
                    <button onClick={addUpcoming} className={`${ghostBtn} w-full`}>
                      Add expense
                    </button>
                  </div>
                </div>

                {/* Step 9: ledger of saved contributions */}
                <div className={`${card} p-6`}>
                  <div className="flex items-center gap-2 mb-4">
                    <FileStack size={17} className="text-[#B8860B]" />
                    <h2 className="font-serif text-xl">Savings ledger</h2>
                  </div>
                  {savingsTxns.length === 0 ? (
                    <p className="text-sm text-[#8A8371]">No contributions yet. Accept a recommendation to start your ledger.</p>
                  ) : (
                    <div className="divide-y divide-[#E7E0CC]">
                      {savingsTxns.slice(0, 8).map((t) => (
                        <div key={t.id} className="py-3">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-serif text-base truncate">
                              {t.destination === "emergency_buffer" ? "Emergency buffer" : goals.find((g) => g.id === t.goalId)?.name ?? "Goal"}
                            </span>
                            <span className="flex-1 border-b border-dotted border-[#C9BF9F] mx-1 min-w-[16px]" />
                            <span className="font-serif text-base tabular-nums text-[#3F6B4D] whitespace-nowrap">+{inr(t.amount)}</span>
                          </div>
                          <p className="text-xs text-[#8A8371] mt-0.5">{toISO(new Date(t.createdAt))}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Other goals (investment / other financial goals) */}
            <div className="mb-3">
              <h2 className="font-serif text-2xl">Other goals</h2>
              <p className="text-sm text-[#5B5540] mt-0.5">
                Where surplus goes once your buffer is healthy.
                {nearestGoal ? ` Closest finish line: ${nearestGoal.name} (${daysLeft(nearestGoal.targetDate)} days).` : ""}
              </p>
            </div>

            {goals.length === 0 ? (
              <div className={`${card} p-12 text-center`}>
                <Sparkles className="mx-auto text-[#8A8371] mb-3" size={26} />
                <p className="text-[#5B5540] text-sm">No goals yet. Create one so surplus has somewhere to go.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {goals.map((goal) => {
                  const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                  const color = categoryColor[goal.category] || categoryColor.Other;
                  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
                  return (
                    <div key={goal.id} className={`${card} p-6 flex gap-5`}>
                      <GoalJar percent={percent} color={color} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-medium mb-1" style={{ color }}>
                              {goal.category}
                            </p>
                            <h3 className="font-serif text-xl truncate">{goal.name}</h3>
                          </div>
                          <button onClick={() => deleteGoal(goal.id)} className="text-[#A6432D] hover:text-[#7E3120] transition-colors shrink-0" title="Delete goal">
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="font-serif text-xl tabular-nums">{inr(goal.currentAmount)}</span>
                          <span className="text-sm text-[#8A8371]">of {inr(goal.targetAmount)}</span>
                        </div>
                        <div className="h-1.5 bg-[#EFE9D8] rounded-full mt-2 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, percent)}%`, backgroundColor: color }} />
                        </div>
                        <p className="text-xs text-[#8A8371] mt-2.5">
                          {inr(remaining)} to go · {daysLeft(goal.targetDate)}d left
                        </p>
                        {goal.notes && <p className="text-sm text-[#5B5540] mt-2">{goal.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* New goal form */}
            {showForm && (
              <div className={`mt-10 ${card} p-8`}>
                <h2 className="font-serif text-2xl mb-6">New goal</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Goal name, e.g. New bike" className={inputClass} />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                    {Object.keys(categoryColor).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="Target amount" className={inputClass} />
                  <input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="Already saved (optional)" className={inputClass} />
                  <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className={inputClass} />
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className={`${inputClass} min-h-11`} />
                </div>
                <button onClick={addGoal} disabled={busy} className={`${primaryBtn} mt-6`}>
                  {busy && <Loader2 size={16} className="animate-spin" />}
                  Create goal
                </button>
              </div>
            )}
          </>
        )}

        <div className={`mt-10 ${card} px-5 py-4`}>
          <p className="text-xs text-[#8A8371] leading-relaxed">
            RupeeMate Savings Goals helps you plan small, regular transfers from your income. Suggestions are estimates based
            on the data you log. It does not guarantee returns and does not replace professional financial advice.
          </p>
        </div>
      </div>
    </main>
  );
}