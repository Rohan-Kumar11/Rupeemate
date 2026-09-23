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

// If you keep a shared types file, move this into it (e.g. "@/types/financial").
// Left local here so this file drops in standalone.
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

const categoryColor: Record<string, string> = {
  "Emergency Fund": "#E8871E",
  "Vehicle & Equipment": "#2E8B7A",
  "Rent Buffer": "#7A5FD9",
  "Health & Insurance": "#D9536F",
  "Skill & Tools": "#2E7DD1",
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
  "w-full bg-white border border-[#D8E4DE] rounded-lg px-3.5 py-2.5 text-[#0F2E27] placeholder:text-[#8FA79D] focus:outline-none focus:border-[#2E8B7A] focus:ring-2 focus:ring-[#2E8B7A]/15 transition-all text-sm";

function daysLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function GoalJar({ percent, color }: { percent: number; color: string }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const fillY = 56 - (clamped / 100) * 56;
  return (
    <svg viewBox="0 0 48 64" className="w-12 h-16 shrink-0" aria-hidden="true">
      <defs>
        <clipPath id={`jar-${color.replace("#", "")}`}>
          <path d="M6 8 h36 v46 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 z" />
        </clipPath>
      </defs>
      <path
        d="M6 8 h36 v46 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 z"
        fill="#F1F7F4"
        stroke="#D8E4DE"
        strokeWidth="1.5"
      />
      <rect x="16" y="2" width="16" height="7" rx="2" fill="#D8E4DE" />
      <g clipPath={`url(#jar-${color.replace("#", "")})`}>
        <rect x="4" y={8 + fillY} width="40" height={56 - fillY} fill={color} opacity="0.85" />
      </g>
    </svg>
  );
}

export default function SavingsGoalsPage() {
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
    <main className="min-h-screen bg-[#F5FAF7] text-[#0F2E27] pt-20 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#0F2E27] text-[#EAF5EF] px-3.5 py-1.5 rounded-full text-xs font-medium mb-4">
              <PiggyBank size={13} />
              Savings Goals
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] text-[#0F2E27]">
              Small drops from every payout, filling something real
            </h1>
            <p className="text-[#4D6B62] mt-4 text-[15px] leading-relaxed">
              Set a goal, let a slice of every gig payment flow toward it automatically,
              and watch the jar rise without touching a single transaction yourself.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0F2E27] text-white font-medium rounded-full shadow-sm hover:bg-[#173E33] transition-colors self-start lg:self-center"
          >
            <Plus size={18} />
            New goal
          </button>
        </div>

        {/* Momentum strip */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-[#E1EEE8] p-6">
            <div className="flex items-center gap-2 text-[#4D6B62] text-sm font-medium mb-3">
              <TrendingUp size={16} className="text-[#2E8B7A]" />
              Total saved
            </div>
            <p className="text-3xl font-semibold tabular-nums text-[#0F2E27]">
              ₹{totalSaved.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-[#8FA79D] mt-1">
              of ₹{totalTarget.toLocaleString("en-IN")} across {goals.length} goal(s)
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E1EEE8] p-6">
            <div className="flex items-center gap-2 text-[#4D6B62] text-sm font-medium mb-3">
              <Zap size={16} className="text-[#E8871E]" />
              Auto-save pace
            </div>
            <p className="text-3xl font-semibold tabular-nums text-[#0F2E27]">
              ₹{Math.round(dailyPace).toLocaleString("en-IN")}
              <span className="text-base font-normal text-[#8FA79D]">/day</span>
            </p>
            <p className="text-sm text-[#8FA79D] mt-1">{activeAutoSaves.length} goal(s) on autopilot</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E1EEE8] p-6">
            <div className="flex items-center gap-2 text-[#4D6B62] text-sm font-medium mb-3">
              <Target size={16} className="text-[#7A5FD9]" />
              Closest finish line
            </div>
            {nearestGoal ? (
              <>
                <p className="text-lg font-semibold text-[#0F2E27] truncate">{nearestGoal.name}</p>
                <p className="text-sm text-[#8FA79D] mt-1">{daysLeft(nearestGoal.targetDate)} days to target date</p>
              </>
            ) : (
              <p className="text-sm text-[#8FA79D]">No goals in progress yet.</p>
            )}
          </div>
        </div>

        {showForm && (
          <div className="mb-10 p-8 rounded-2xl bg-white border border-[#E1EEE8] shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0F2E27] mb-6">Set a new goal</h2>
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
                <input type="checkbox" checked={autoSaveEnabled} onChange={(e) => setAutoSaveEnabled(e.target.checked)} className="w-4 h-4 accent-[#2E8B7A]" />
                <span className="text-sm text-[#4D6B62]">Auto-save toward this goal from incoming payouts</span>
              </label>
            </div>
            <button onClick={addGoal} className="mt-6 px-8 py-3 bg-[#0F2E27] text-white font-medium rounded-full hover:bg-[#173E33] transition-colors">
              Create goal
            </button>
          </div>
        )}

        {/* Goal jars */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E1EEE8] p-12 text-center">
            <Sparkles className="mx-auto text-[#8FA79D] mb-3" size={28} />
            <p className="text-[#4D6B62]">No goals yet. Create one to start auto-saving.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {goals.map((goal) => {
              const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const color = categoryColor[goal.category] || categoryColor.Other;
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
              return (
                <div key={goal.id} className="bg-white rounded-2xl border border-[#E1EEE8] p-6 flex gap-5">
                  <GoalJar percent={percent} color={color} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium mb-1" style={{ color }}>
                          {goal.category}
                        </p>
                        <h3 className="font-semibold text-[#0F2E27] text-lg truncate">{goal.name}</h3>
                      </div>
                      <button onClick={() => deleteGoal(goal.id)} className="text-[#B7C9C2] hover:text-[#D9536F] transition-colors shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-xl font-semibold tabular-nums text-[#0F2E27]">
                        ₹{goal.currentAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-[#8FA79D]">of ₹{goal.targetAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="h-2 bg-[#EAF5EF] rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, percent)}%`, backgroundColor: color }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-[#8FA79D]">
                      <span>₹{remaining.toLocaleString("en-IN")} to go · {daysLeft(goal.targetDate)}d left</span>
                      {goal.autoSaveEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[#2E8B7A] font-medium">
                          <Zap size={11} />₹{goal.autoSaveAmount}/{goal.autoSaveFrequency === "daily" ? "day" : "wk"}
                        </span>
                      ) : (
                        <span>Manual saving</span>
                      )}
                    </div>

                    {goal.notes && <p className="text-sm text-[#4D6B62] mt-3">{goal.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 p-4 rounded-xl bg-white border border-[#E1EEE8]">
          <p className="text-xs text-[#8FA79D] leading-relaxed">
            RupeeMate Savings Goals helps you set targets and automate small, regular transfers from
            your income. It does not guarantee returns and does not replace professional financial advice.
          </p>
        </div>
      </div>
    </main>
  );
}