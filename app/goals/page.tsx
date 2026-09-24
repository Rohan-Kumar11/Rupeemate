"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Target,
  Zap,
  PiggyBank,
  Sparkles,
  TrendingUp,
} from "lucide-react";

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

// Muted, ledger-friendly palette
const categoryColor: Record<string, string> = {
  "Emergency Fund": "#B8860B",
  "Vehicle & Equipment": "#1B2B44",
  "Rent Buffer": "#3F6B4D",
  "Health & Insurance": "#A6432D",
  "Skill & Tools": "#5B5540",
  Other: "#8A8371",
};

const defaultGoals: SavingsGoal[] = [
  {
    id: "goal-1",
    name: "3-month emergency cushion",
    category: "Emergency Fund",
    targetAmount: 30000,
    currentAmount: 12400,
    targetDate: "2026-12-31",
    autoSaveEnabled: true,
    autoSaveAmount: 100,
    autoSaveFrequency: "daily",
    notes: "Builds from every delivery payout automatically.",
  },
  {
    id: "goal-2",
    name: "New delivery bike",
    category: "Vehicle & Equipment",
    targetAmount: 45000,
    currentAmount: 9000,
    targetDate: "2027-03-01",
    autoSaveEnabled: true,
    autoSaveAmount: 250,
    autoSaveFrequency: "weekly",
  },
];

const inputClass =
  "w-full bg-[#FCFAF4] border border-[#D9D0B8] rounded-md px-3.5 py-2.5 text-[#1B2B44] placeholder:text-[#9A927B] focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 transition-colors font-sans text-sm";


// Applies the Tax Center cream background to the whole page (body), so no white shows around/behind content
function useLedgerBackground() {
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#F7F3E9";
    return () => { document.body.style.backgroundColor = prev; };
  }, []);
}

function daysLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function GoalJar({ percent, color, id }: { percent: number; color: string; id: string }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const fillY = 56 - (clamped / 100) * 56;
  const clipId = `jar-${id}`;
  return (
    <svg viewBox="0 0 48 64" className="w-12 h-16 shrink-0" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path d="M6 8 h36 v46 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 z" />
        </clipPath>
      </defs>
      <path
        d="M6 8 h36 v46 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 z"
        fill="#EFE9D8"
        stroke="#D9D0B8"
        strokeWidth="1.5"
      />
      <rect x="16" y="2" width="16" height="7" rx="2" fill="#D9D0B8" />
      <g clipPath={`url(#${clipId})`}>
        <rect x="4" y={8 + fillY} width="40" height={56 - fillY} fill={color} opacity="0.85" />
      </g>
    </svg>
  );
}

export default function SavingsGoalsPage() {
  useLedgerBackground();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Emergency Fund");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [autoSaveAmount, setAutoSaveAmount] = useState("");
  const [autoSaveFrequency, setAutoSaveFrequency] = useState<SavingsGoal["autoSaveFrequency"]>("daily");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("rupeemate_savings_goals");
    if (stored) {
      setGoals(JSON.parse(stored));
    } else {
      localStorage.setItem("rupeemate_savings_goals", JSON.stringify(defaultGoals));
      setGoals(defaultGoals);
    }
  }, []);

  const saveGoals = (updated: SavingsGoal[]) => {
    setGoals(updated);
    localStorage.setItem("rupeemate_savings_goals", JSON.stringify(updated));
  };

  const addGoal = () => {
    if (!name || !targetAmount || !targetDate) return;
    const newGoal: SavingsGoal = {
      id: crypto.randomUUID(),
      name,
      category,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDate,
      autoSaveEnabled,
      autoSaveAmount: Number(autoSaveAmount || 0),
      autoSaveFrequency,
      notes: notes || undefined,
    };
    saveGoals([...goals, newGoal]);
    setName("");
    setCategory("Emergency Fund");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
    setAutoSaveEnabled(true);
    setAutoSaveAmount("");
    setAutoSaveFrequency("daily");
    setNotes("");
    setShowForm(false);
  };

  const deleteGoal = (id: string) => saveGoals(goals.filter((g) => g.id !== id));

  const totalSaved = useMemo(() => goals.reduce((t, g) => t + g.currentAmount, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((t, g) => t + g.targetAmount, 0), [goals]);
  const activeAutoSaves = useMemo(() => goals.filter((g) => g.autoSaveEnabled), [goals]);
  const dailyPace = useMemo(
    () =>
      activeAutoSaves.reduce(
        (t, g) => t + (g.autoSaveFrequency === "daily" ? g.autoSaveAmount : g.autoSaveAmount / 7),
        0
      ),
    [activeAutoSaves]
  );

  const nearestGoal = useMemo(() => {
    const unfinished = goals.filter((g) => g.currentAmount < g.targetAmount);
    if (unfinished.length === 0) return null;
    return [...unfinished].sort((a, b) => daysLeft(a.targetDate) - daysLeft(b.targetDate))[0];
  }, [goals]);

  return (
    <main className="min-h-screen bg-[#F7F3E9] text-[#1B2B44] pt-20 pb-20 px-6 font-sans" style={{ backgroundColor: "#F7F3E9" }}>
      <div className="max-w-6xl mx-auto">
        {/* Folder-tab header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#1B2B44] text-[#F7F3E9] px-4 py-1.5 rounded-t-md text-xs tracking-wide font-medium">
            <PiggyBank size={14} />
            Savings Goals
          </div>
          <div className="border border-[#D9D0B8] bg-[#FCFAF4] rounded-b-md rounded-tr-md px-8 py-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl text-[#1B2B44] leading-tight">
                  Small drops from every payout, filling something real
                </h1>
                <p className="text-[#5B5540] mt-3 max-w-lg text-[15px] leading-relaxed">
                  Set a goal, let a slice of every gig payment flow toward it automatically,
                  and watch the jar rise without touching a single transaction yourself.
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1B2B44] text-[#F7F3E9] font-medium rounded-md hover:bg-[#243A5E] transition-colors whitespace-nowrap"
              >
                <Plus size={17} />
                New goal
              </button>
            </div>
          </div>
        </div>

        {/* Ledger summary strip */}
        <div className="grid sm:grid-cols-3 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] mb-10 divide-y sm:divide-y-0 sm:divide-x divide-[#D9D0B8]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-[#8A8371]">Total saved</p>
              <TrendingUp size={14} className="text-[#B8860B]" />
            </div>
            <p className="font-serif text-3xl text-[#1B2B44] tabular-nums">
              ₹{totalSaved.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-[#8A8371] mt-1">
              of ₹{totalTarget.toLocaleString("en-IN")} across {goals.length} goal(s)
            </p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-[#8A8371]">Auto-save pace</p>
              <Zap size={14} className="text-[#B8860B]" />
            </div>
            <p className="font-serif text-3xl text-[#1B2B44] tabular-nums">
              ₹{Math.round(dailyPace).toLocaleString("en-IN")}
              <span className="text-base text-[#8A8371] font-sans">/day</span>
            </p>
            <p className="text-sm text-[#8A8371] mt-1">{activeAutoSaves.length} goal(s) on autopilot</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-[#8A8371]">Closest finish line</p>
              <Target size={14} className="text-[#B8860B]" />
            </div>
            {nearestGoal ? (
              <>
                <p className="font-serif text-xl text-[#1B2B44] truncate">{nearestGoal.name}</p>
                <p className="text-sm text-[#8A8371] mt-1">{daysLeft(nearestGoal.targetDate)} days to target date</p>
              </>
            ) : (
              <p className="text-sm text-[#8A8371]">No goals in progress yet.</p>
            )}
          </div>
        </div>

        {showForm && (
          <div className="mb-10 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-8">
            <h2 className="font-serif text-2xl text-[#1B2B44] mb-6">Set a new goal</h2>
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
              <div className="flex gap-2">
                <input
                  type="number"
                  value={autoSaveAmount}
                  onChange={(e) => setAutoSaveAmount(e.target.value)}
                  placeholder="Auto-save amount"
                  className={inputClass}
                />
                <select
                  value={autoSaveFrequency}
                  onChange={(e) => setAutoSaveFrequency(e.target.value as SavingsGoal["autoSaveFrequency"])}
                  className={`${inputClass} w-28 shrink-0`}
                >
                  <option value="daily">/ day</option>
                  <option value="weekly">/ week</option>
                </select>
              </div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className={`${inputClass} md:col-span-2 min-h-20`} />
              <label className="flex items-center gap-2.5 md:col-span-2 cursor-pointer">
                <input type="checkbox" checked={autoSaveEnabled} onChange={(e) => setAutoSaveEnabled(e.target.checked)} className="w-4 h-4 accent-[#B8860B]" />
                <span className="text-sm text-[#5B5540]">Auto-save toward this goal from incoming payouts</span>
              </label>
            </div>
            <button onClick={addGoal} className="mt-6 px-6 py-2.5 bg-[#1B2B44] text-[#F7F3E9] rounded-md font-medium hover:bg-[#243A5E] transition-colors">
              Create goal
            </button>
          </div>
        )}

        {/* Goal jars */}
        {goals.length === 0 ? (
          <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-12 text-center">
            <Sparkles className="mx-auto text-[#B8860B] mb-3" size={28} />
            <p className="text-[#8A8371] text-sm">No goals yet. Create one to start auto-saving.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const color = categoryColor[goal.category] || categoryColor.Other;
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
              return (
                <div key={goal.id} className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-6 flex gap-5 group">
                  <GoalJar percent={percent} color={color} id={goal.id} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide font-medium mb-1" style={{ color }}>
                          {goal.category}
                        </p>
                        <h3 className="font-serif text-xl text-[#1B2B44] truncate">{goal.name}</h3>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        aria-label="Remove goal"
                        className="text-[#A6432D] hover:text-[#7E3120] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="font-serif text-2xl tabular-nums text-[#1B2B44]">
                        ₹{goal.currentAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-[#8A8371]">of ₹{goal.targetAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="h-1.5 bg-[#EFE9D8] rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, percent)}%`, backgroundColor: color }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-[#8A8371]">
                      <span>₹{remaining.toLocaleString("en-IN")} to go · {daysLeft(goal.targetDate)}d left</span>
                      {goal.autoSaveEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[#3F6B4D] font-medium">
                          <Zap size={11} />₹{goal.autoSaveAmount}/{goal.autoSaveFrequency === "daily" ? "day" : "wk"}
                        </span>
                      ) : (
                        <span>Manual saving</span>
                      )}
                    </div>

                    {goal.notes && (
                      <p className="text-sm text-[#5B5540] mt-3 border-l-2 border-[#B8860B] pl-3">{goal.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] px-5 py-4">
          <p className="text-xs text-[#8A8371] leading-relaxed">
            RupeeMate Savings Goals helps you set targets and automate small, regular transfers from
            your income. It does not guarantee returns and does not replace professional financial advice.
          </p>
        </div>
      </div>
    </main>
  );
}