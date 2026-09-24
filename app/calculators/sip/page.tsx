"use client";

import React, { useMemo, useState } from "react";
import { Calculator, TrendingUp, PiggyBank, Wallet } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";
import GoalInvestmentContext from "@/components/GoalInvestmentContext";

const fmt = (v: number): string => {
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
};
const fmtAxis = (v: number): string =>
  v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(0)}L` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : `${v}`;

const inputClass =
  "w-full bg-[#F7F3E9] border border-[#D9D0B8] rounded-md px-3.5 py-2.5 text-[#1B2B44] focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 transition-colors text-base tabular-nums";

function Field({ label, hint, value, min, max, step, suffix, onChange }: {
  label: string; hint: string; value: number; min: number; max: number; step: number; suffix?: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <label className="font-serif text-lg text-[#1B2B44]">{label}</label>
        <span className="font-serif text-lg text-[#B8860B] tabular-nums whitespace-nowrap">
          {suffix === "₹" ? fmt(value) : `${value}${suffix ?? ""}`}
        </span>
      </div>
      <p className="text-xs text-[#8A8371] mb-3">{hint}</p>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 cursor-pointer accent-[#B8860B] mb-3" />
      <input type="number" inputMode="decimal" value={value} step={step}
        onChange={(e) => onChange(Number(e.target.value))} className={inputClass} />
    </div>
  );
}

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const fv = (months: number) => {
    const r = rate / 1200;
    return r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  };

  const { invested, total, returns, chart } = useMemo(() => {
    const invested = monthly * years * 12;
    const total = fv(years * 12);
    const chart = Array.from({ length: Math.min(years, 40) + 1 }, (_, y) => ({
      year: y, invested: monthly * y * 12, value: Math.round(fv(y * 12)),
    }));
    return { invested, total, returns: total - invested, chart };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthly, rate, years]);

  const investedPct = total > 0 ? (invested / total) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#F7F3E9] text-[#1B2B44] pt-20 pb-16 px-4 sm:px-6 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <GoalInvestmentContext />
        </div>

        {/* Folder-tab header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1B2B44] text-[#F7F3E9] px-4 py-1.5 rounded-t-md text-xs tracking-wide font-medium">
            <Calculator size={14} /> SIP Calculator
          </div>
          <div className="border border-[#D9D0B8] bg-[#FCFAF4] rounded-b-md rounded-tr-md px-5 py-6 sm:px-8 sm:py-8 shadow-sm">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">Watch small habits compound</h1>
            <p className="text-[#5B5540] mt-3 max-w-lg text-sm sm:text-[15px] leading-relaxed">
              Invest a fixed amount every month and see what disciplined investing can grow into.
            </p>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid sm:grid-cols-3 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] mb-8 divide-y sm:divide-y-0 sm:divide-x divide-[#D9D0B8]">
          {[
            { label: "Invested amount", value: fmt(invested), color: "text-[#1B2B44]", Icon: PiggyBank },
            { label: "Estimated returns", value: fmt(returns), color: "text-[#3F6B4D]", Icon: TrendingUp },
            { label: "Total value", value: fmt(total), color: "text-[#B8860B]", Icon: Wallet },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide text-[#8A8371]">{label}</p>
                <Icon size={14} className="text-[#B8860B]" />
              </div>
              <p className={`font-serif text-3xl tabular-nums ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Inputs */}
          <div className="lg:col-span-2 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-5 sm:p-8 divide-y divide-[#E7E0CC]">
            <Field label="Monthly investment" hint="Amount invested each month" value={monthly} min={500} max={100000} step={500} suffix="₹" onChange={setMonthly} />
            <Field label="Expected return" hint="Annual growth rate (% p.a.)" value={rate} min={1} max={30} step={0.5} suffix="%" onChange={setRate} />
            <Field label="Time period" hint="Duration in years" value={years} min={1} max={40} step={1} suffix=" yrs" onChange={setYears} />
          </div>

          {/* Chart + breakdown */}
          <div className="lg:col-span-3 space-y-6">
            <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-4 sm:p-8">
              <h2 className="font-serif text-xl sm:text-2xl mb-4 sm:mb-6 px-1">Growth over time</h2>
              <div className="h-64 sm:h-80 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#B8860B" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#B8860B" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E7E0CC" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" stroke="#8A8371" tick={{ fontSize: 11 }} tickLine={false} />
                    <YAxis width={44} stroke="#8A8371" tick={{ fontSize: 11 }} tickLine={false} tickFormatter={fmtAxis} />
                    <Tooltip
                      formatter={(v, n) => [fmt(Number(v)), n === "value" ? "Total value" : "Invested"]}
                      labelFormatter={(l) => `Year ${l}`}
                      contentStyle={{ background: "#FCFAF4", border: "1px solid #D9D0B8", borderRadius: 6, fontSize: 13 }}
                    />
                    <Area type="monotone" dataKey="invested" stroke="#1B2B44" strokeWidth={2} fill="none" />
                    <Area type="monotone" dataKey="value" stroke="#B8860B" strokeWidth={2.5} fill="url(#gVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-3 text-xs text-[#5B5540]">
                <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-[#1B2B44]" /> Invested</span>
                <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-[#B8860B]" /> Total value</span>
              </div>
            </div>

            <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-5 sm:p-8">
              <h2 className="font-serif text-xl sm:text-2xl mb-4">Wealth breakdown</h2>
              <div className="h-3 bg-[#EFE9D8] rounded-full overflow-hidden flex">
                <div className="h-full bg-[#1B2B44] transition-all duration-500" style={{ width: `${investedPct}%` }} />
                <div className="h-full bg-[#B8860B] transition-all duration-500" style={{ width: `${100 - investedPct}%` }} />
              </div>
              <div className="flex justify-between mt-3 text-sm gap-3">
                <span className="text-[#5B5540]"><span className="inline-block w-2 h-2 rounded-full bg-[#1B2B44] mr-2" />Your money {investedPct.toFixed(1)}%</span>
                <span className="text-[#5B5540] text-right"><span className="inline-block w-2 h-2 rounded-full bg-[#B8860B] mr-2" />Growth {(100 - investedPct).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] px-5 py-4">
          <p className="text-xs text-[#8A8371] leading-relaxed">
            Projections assume a constant return and are illustrative only. Actual mutual fund returns vary and are not guaranteed.
          </p>
        </div>
      </div>
    </main>
  );
}