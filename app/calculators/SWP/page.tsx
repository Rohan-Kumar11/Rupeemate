"use client";

import React, { useMemo, useState } from "react";
import { ArrowDownCircle, AlertTriangle, Wallet, TrendingDown, BarChart3 } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";

const fmt = (v: number): string => {
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} L`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
};
const fmtAxis = (v: number): string =>
  v >= 1e7 ? `${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `${(v / 1e5).toFixed(0)}L` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : `${v}`;

const inputClass =
  "w-full bg-[#F7F3E9] border border-[#D9D0B8] rounded-md px-3.5 py-2.5 text-[#1B2B44] focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 transition-colors text-base tabular-nums";

function Field({ label, value, display, min, max, step, onChange }: {
  label: string; value: number; display: string; min: number; max: number; step: number; onChange: (n: number) => void;
}) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <label className="font-serif text-lg">{label}</label>
        <span className="font-serif text-lg text-[#B8860B] tabular-nums whitespace-nowrap">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 cursor-pointer accent-[#B8860B] mb-3" />
      <input type="number" inputMode="decimal" value={value} step={step}
        onChange={(e) => onChange(Number(e.target.value))} className={inputClass} />
    </div>
  );
}

export default function SWPCalculator() {
  const [corpus, setCorpus] = useState(500000);
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const { withdrawn, remaining, monthsLasted, chart } = useMemo(() => {
    const r = rate / 1200;
    let bal = corpus, withdrawn = 0, monthsLasted = 0;
    const chart = [{ year: 0, corpus: corpus, withdrawn: 0 }];
    for (let i = 0; i < years * 12; i++) {
      bal *= 1 + r;
      if (bal >= monthly) { bal -= monthly; withdrawn += monthly; monthsLasted++; } else break;
      if ((i + 1) % 12 === 0) chart.push({ year: (i + 1) / 12, corpus: Math.round(bal), withdrawn: Math.round(withdrawn) });
    }
    return { withdrawn, remaining: Math.max(0, bal), monthsLasted, chart };
  }, [corpus, monthly, rate, years]);

  const withdrawalPct = corpus > 0 ? ((monthly * 12) / corpus) * 100 : 0;
  const lastYears = (monthsLasted / 12).toFixed(1);
  const depleted = monthsLasted < years * 12;

  return (
    <main className="min-h-screen bg-[#F7F3E9] text-[#1B2B44] pt-20 pb-16 px-4 sm:px-6 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1B2B44] text-[#F7F3E9] px-4 py-1.5 rounded-t-md text-xs tracking-wide font-medium">
            <ArrowDownCircle size={14} /> SWP Calculator
          </div>
          <div className="border border-[#D9D0B8] bg-[#FCFAF4] rounded-b-md rounded-tr-md px-5 py-6 sm:px-8 sm:py-8 shadow-sm">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">A steady income from your corpus</h1>
            <p className="text-[#5B5540] mt-3 max-w-lg text-sm sm:text-[15px] leading-relaxed">
              Plan systematic withdrawals while the remaining balance keeps growing.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] mb-8 divide-y sm:divide-y-0 sm:divide-x divide-[#D9D0B8]">
          {[
            { label: "Total withdrawn", value: fmt(withdrawn), sub: `Over ${lastYears} years`, color: "text-[#3F6B4D]", Icon: TrendingDown },
            { label: "Remaining corpus", value: fmt(remaining), sub: "After withdrawal period", color: "text-[#1B2B44]", Icon: Wallet },
            { label: "Total benefit", value: fmt(withdrawn + remaining), sub: "Withdrawn + remaining", color: "text-[#B8860B]", Icon: BarChart3 },
          ].map(({ label, value, sub, color, Icon }) => (
            <div key={label} className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide text-[#8A8371]">{label}</p>
                <Icon size={14} className="text-[#B8860B]" />
              </div>
              <p className={`font-serif text-3xl tabular-nums ${color}`}>{value}</p>
              <p className="text-sm text-[#8A8371] mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-5 sm:p-8 divide-y divide-[#E7E0CC]">
              <Field label="Investment corpus" value={corpus} display={fmt(corpus)} min={100000} max={10000000} step={50000} onChange={setCorpus} />
              <Field label="Monthly withdrawal" value={monthly} display={fmt(monthly)} min={1000} max={200000} step={1000} onChange={setMonthly} />
              <Field label="Expected return" value={rate} display={`${rate}%`} min={4} max={20} step={0.5} onChange={setRate} />
              <Field label="Planning horizon" value={years} display={`${years} yrs`} min={1} max={30} step={1} onChange={setYears} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {depleted && (
              <div className="border border-[#A6432D]/40 bg-[#FCFAF4] rounded-md p-4 flex gap-3 border-l-4 border-l-[#A6432D]">
                <AlertTriangle size={18} className="text-[#A6432D] shrink-0 mt-0.5" />
                <p className="text-sm text-[#4A4433] leading-relaxed">
                  Your corpus runs out after about {lastYears} years at this rate. Consider lowering withdrawals or extending returns.
                </p>
              </div>
            )}

            <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-4 sm:p-8">
              <h2 className="font-serif text-xl sm:text-2xl mb-4 sm:mb-6 px-1">Withdrawal projection</h2>
              <div className="h-64 sm:h-80 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gCorpus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1B2B44" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1B2B44" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E7E0CC" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" stroke="#8A8371" tick={{ fontSize: 11 }} tickLine={false} />
                    <YAxis width={44} stroke="#8A8371" tick={{ fontSize: 11 }} tickLine={false} tickFormatter={fmtAxis} />
                    <Tooltip
                      formatter={(v, n) => [fmt(Number(v)), n === "corpus" ? "Remaining corpus" : "Total withdrawn"]}
                      labelFormatter={(l) => `Year ${l}`}
                      contentStyle={{ background: "#FCFAF4", border: "1px solid #D9D0B8", borderRadius: 6, fontSize: 13 }}
                    />
                    <Area type="monotone" dataKey="corpus" stroke="#1B2B44" strokeWidth={2.5} fill="url(#gCorpus)" />
                    <Area type="monotone" dataKey="withdrawn" stroke="#B8860B" strokeWidth={2} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-3 text-xs text-[#5B5540]">
                <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-[#1B2B44]" /> Remaining corpus</span>
                <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-[#B8860B]" /> Total withdrawn</span>
              </div>
            </div>

            <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-5 sm:p-8">
              <h2 className="font-serif text-xl sm:text-2xl mb-4">Your withdrawal plan</h2>
              <div className="divide-y divide-[#E7E0CC] text-sm">
                <div className="flex justify-between py-3"><span className="text-[#5B5540]">Annual withdrawal</span><span className="font-medium tabular-nums">{fmt(monthly * 12)}</span></div>
                <div className="flex justify-between py-3"><span className="text-[#5B5540]">Withdrawal rate</span>
                  <span className={`font-medium tabular-nums ${withdrawalPct > 6 ? "text-[#A6432D]" : "text-[#3F6B4D]"}`}>{withdrawalPct.toFixed(2)}%</span></div>
              </div>
              <p className="text-xs text-[#8A8371] mt-4 leading-relaxed">
                A 4–6% annual withdrawal rate is often suggested for long-term sustainability.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] px-5 py-4">
          <p className="text-xs text-[#8A8371] leading-relaxed">
            Projections assume a constant return and ignore tax and exit loads. They are illustrative only.
          </p>
        </div>
      </div>
    </main>
  );
}