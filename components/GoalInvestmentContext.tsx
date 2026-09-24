"use client";

import React, { useEffect, useState } from "react";
import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";

// ── Ledger palette (matches Tax Center / Manager) ──
const INK = "#1B2B44";
const PAPER = "#FCFAF4";
const LINE = "#D9D0B8";
const AMBER = "#B8860B";
const TEAL = "#3F6B4D";
const ROSE = "#A6432D";
const MUTED = "#8A8371";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  priority: "High" | "Medium" | "Low";
  status: "active" | "completed" | "paused";
}

export default function GoalInvestmentContext() {
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rupeemate_goals");

      if (!stored) return;

      const goals: Goal[] = JSON.parse(stored);

      const activeGoals = goals.filter(
        (item) => item.status === "active"
      );

      const priorityGoal =
        activeGoals.find((item) => item.priority === "High") ||
        activeGoals[0] ||
        null;

      setGoal(priorityGoal);
    } catch (error) {
      console.error("Unable to load goal:", error);
    }
  }, []);

  if (!goal) return null;

  const target = Number(goal.target_amount || 0);
  const saved = Number(goal.current_amount || 0);
  const remaining = Math.max(0, target - saved);

  const progress =
    target > 0 ? Math.min(100, (saved / target) * 100) : 0;

  return (
    <div className="rounded-md shadow-sm p-5" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: `${AMBER}1A` }}>
            <Target style={{ color: AMBER }} size={20} />
          </div>

          <div>
            <p className="text-xs" style={{ color: MUTED }}>
              Priority Financial Goal
            </p>

            <h3 className="font-serif text-lg" style={{ color: INK }}>
              {goal.name}
            </h3>
          </div>

        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${INK}0D`, color: INK }}>
          {goal.priority}
        </span>

      </div>


      <div className="grid grid-cols-3 gap-3 text-center mb-4">

        <div>
          <p className="text-xs" style={{ color: MUTED }}>Target</p>
          <p className="font-bold" style={{ color: INK }}>
            ₹{target.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs" style={{ color: MUTED }}>Saved</p>
          <p className="font-bold" style={{ color: TEAL }}>
            ₹{saved.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs" style={{ color: MUTED }}>Remaining</p>
          <p className="font-bold" style={{ color: ROSE }}>
            ₹{remaining.toLocaleString()}
          </p>
        </div>

      </div>


      <div className="mb-4">

        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: MUTED }}>Progress</span>

          <span className="font-semibold" style={{ color: AMBER }}>
            {progress.toFixed(0)}%
          </span>
        </div>

        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#EFE9D8" }}>

          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: AMBER }}
          />

        </div>

      </div>


      <Link
        href="/calculators/sip"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md font-semibold transition hover:opacity-90"
        style={{ backgroundColor: INK, color: PAPER }}
      >
        Plan Savings for Goal
        <ArrowRight size={16} />
      </Link>

    </div>
  );
}