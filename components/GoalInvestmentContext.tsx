"use client";

import React, { useEffect, useState } from "react";
import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";

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
    <div className="rounded-2xl bg-white border border-blue-100 shadow-lg p-5">

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Target className="text-blue-600" size={20} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Priority Financial Goal
            </p>

            <h3 className="font-bold text-gray-900">
              {goal.name}
            </h3>
          </div>

        </div>

        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
          {goal.priority}
        </span>

      </div>


      <div className="grid grid-cols-3 gap-3 text-center mb-4">

        <div>
          <p className="text-xs text-gray-500">Target</p>
          <p className="font-bold text-gray-900">
            ₹{target.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Saved</p>
          <p className="font-bold text-emerald-600">
            ₹{saved.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="font-bold text-orange-600">
            ₹{remaining.toLocaleString()}
          </p>
        </div>

      </div>


      <div className="mb-4">

        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>

          <span className="font-semibold text-blue-600">
            {progress.toFixed(0)}%
          </span>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>


      <Link
        href="/calculators/sip"
        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition"
      >
        Plan Savings for Goal
        <ArrowRight size={16} />
      </Link>

    </div>
  );
}