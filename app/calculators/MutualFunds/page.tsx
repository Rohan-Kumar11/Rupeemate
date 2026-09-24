"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Star, X, Bell, RefreshCw, GitCompare, TrendingUp, TrendingDown, Landmark, CheckCircle2, AlertCircle, Info, User } from "lucide-react";

interface Fund {
  id: number; name: string; category: string; nav: number; changePercent: number;
  returns: Record<"1m" | "6m" | "1y" | "3y" | "5y", number>;
  rating: number; aum: string; expenseRatio: number; minInvestment: number; riskLevel: string;
  exitLoad: string; fundManager: string; benchmarkIndex: string; lockInPeriod: string;
}
type SortOption = "returns" | "nav" | "rating" | "aum";
type FundRow = [number, string, string, number, number, [number, number, number, number, number], number, string, number, number, string, string, string, string, string];

// id, name, category, nav, chg%, [1m,6m,1y,3y,5y], rating, aum, expense, minInv, risk, exitLoad, manager, benchmark, lockIn
const rows: FundRow[] = [
  [1, "HDFC Top 100 Fund", "Large Cap", 752.34, 0.31, [3.2, 8.5, 18.5, 15.2, 14.8], 5, "₹45,231 Cr", 1.05, 500, "Moderate", "1% within 1 year", "Chirag Setalvad", "S&P BSE 100", "Nil"],
  [2, "ICICI Prudential Technology Fund", "Sectoral", 142.89, -0.85, [5.8, 15.2, 28.3, 22.1, 19.5], 4, "₹12,456 Cr", 1.89, 1000, "High", "1% within 1 year", "Sankaran Naren", "S&P BSE IT Index", "Nil"],
  [3, "SBI Small Cap Fund", "Small Cap", 98.67, 3.62, [7.1, 18.3, 32.4, 24.6, 21.3], 5, "₹8,934 Cr", 1.25, 500, "Very High", "1% within 1 year", "R. Srinivasan", "S&P BSE Small Cap", "Nil"],
  [4, "Axis Bluechip Fund", "Large Cap", 56.23, 1.61, [2.8, 7.9, 16.8, 14.5, 13.2], 4, "₹32,567 Cr", 0.95, 500, "Moderate", "Nil", "Shreyash Devalkar", "Nifty 100", "Nil"],
  [5, "Mirae Asset Emerging Bluechip", "Large & Mid Cap", 125.45, 1.35, [4.2, 11.5, 22.3, 18.9, 17.1], 5, "₹28,901 Cr", 1.15, 1000, "Moderately High", "1% within 365 days", "Neelesh Surana", "Nifty LargeMid 250", "Nil"],
  [6, "Parag Parikh Flexi Cap Fund", "Flexi Cap", 78.92, 2.75, [5.5, 13.2, 25.6, 20.4, 18.7], 5, "₹51,234 Cr", 1.02, 1000, "Moderately High", "2% within 1 year", "Rajeev Thakkar", "S&P BSE 500", "Nil"],
  [7, "Kotak Corporate Bond Fund", "Debt", 3245.67, 0.01, [0.6, 3.5, 7.2, 6.8, 7.1], 4, "₹15,678 Cr", 0.45, 5000, "Low", "Nil", "Deepak Agarwal", "CRISIL Corporate Bond", "Nil"],
  [8, "UTI Nifty Index Fund", "Index Fund", 234.56, 0.53, [2.5, 7.8, 17.2, 14.8, 13.9], 4, "₹22,345 Cr", 0.25, 500, "Moderate", "Nil", "Sharwan Kumar Goyal", "Nifty 50", "Nil"],
  [9, "Motilal Oswal Nasdaq 100 FOF", "International", 45.67, 4.32, [6.8, 16.5, 35.2, 28.5, 25.3], 5, "₹7,890 Cr", 0.65, 5000, "High", "Nil", "Rakesh Shetty", "Nasdaq 100", "Nil"],
  [10, "Axis ELSS Tax Saver Fund", "ELSS", 67.34, 1.48, [3.5, 9.2, 19.8, 16.5, 15.2], 5, "₹18,456 Cr", 0.89, 500, "Moderately High", "Nil", "Jinesh Gopani", "Nifty 500", "3 Years"],
];
const initialFunds: Fund[] = rows.map((r) => ({
  id: r[0], name: r[1], category: r[2], nav: r[3], changePercent: r[4],
  returns: { "1m": r[5][0], "6m": r[5][1], "1y": r[5][2], "3y": r[5][3], "5y": r[5][4] },
  rating: r[6], aum: r[7], expenseRatio: r[8], minInvestment: r[9], riskLevel: r[10],
  exitLoad: r[11], fundManager: r[12], benchmarkIndex: r[13], lockInPeriod: r[14],
}));

const categories = ["all", "Large Cap", "Small Cap", "Large & Mid Cap", "Flexi Cap", "Sectoral", "Debt", "Index Fund", "ELSS", "International"];
const notifications = [
  { id: 1, type: "success", title: "SIP executed", message: "Your SIP of ₹5,000 in HDFC Top 100 Fund executed successfully", time: "2 hours ago" },
  { id: 2, type: "info", title: "NAV update", message: "Your portfolio is up by 2.3% today", time: "5 hours ago" },
  { id: 3, type: "warning", title: "Rebalance alert", message: "Large cap allocation exceeds 70%", time: "1 day ago" },
];
const profile = { name: "Rajesh Kumar", email: "rajesh.kumar@email.com", pan: "ABCDE1234F", kyc: "Verified", currentValue: 105420 };

const inputClass =
  "w-full bg-[#F7F3E9] border border-[#D9D0B8] rounded-md px-3.5 py-2.5 text-[#1B2B44] placeholder:text-[#9A927B] focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 transition-colors text-base";
const card = "border border-[#D9D0B8] rounded-md bg-[#FCFAF4]";

function Stars({ n, size = 13 }: { n: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={size} className="text-[#B8860B]" fill={i < n ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

function Modal({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="fixed inset-0 z-50 bg-[#1B2B44]/50 flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className={`bg-[#FCFAF4] w-full ${wide ? "sm:max-w-5xl" : "sm:max-w-xl"} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-md border border-[#D9D0B8] shadow-xl`}>
        {children}
      </div>
    </div>
  );
}

export default function MutualFundsPlatform() {
  const [tab, setTab] = useState<"explore" | "watchlist">("explore");
  const [funds, setFunds] = useState<Fund[]>(initialFunds);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("returns");
  const [watchlist, setWatchlist] = useState<number[]>([1, 3]);
  const [compare, setCompare] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [selected, setSelected] = useState<Fund | null>(null);
  const [panel, setPanel] = useState<"notif" | "profile" | null>(null);
  const [invest, setInvest] = useState<"lumpsum" | "sip" | null>(null);
  const [amount, setAmount] = useState(10000);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdate(new Date());
    const t = setInterval(() => {
      setFunds((prev) => prev.map((f) => {
        const d = (Math.random() - 0.5) * 2;
        return { ...f, nav: f.nav + d, changePercent: parseFloat(((d / f.nav) * 100).toFixed(2)) };
      }));
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const toggleWatch = (id: number) => setWatchlist((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const addCompare = (id: number) => setCompare((p) => (p.length < 4 && !p.includes(id) ? [...p, id] : p));

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const list = funds.filter((f) => (f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)) && (cat === "all" || f.category === cat));
    const num = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ""));
    return [...list].sort((a, b) =>
      sortBy === "returns" ? b.returns["1y"] - a.returns["1y"] :
      sortBy === "nav" ? b.nav - a.nav :
      sortBy === "rating" ? b.rating - a.rating : num(b.aum) - num(a.aum));
  }, [funds, query, cat, sortBy]);

  const shown = tab === "watchlist" ? funds.filter((f) => watchlist.includes(f.id)) : filtered;

  const FundCard = (fund: Fund) => {
    const up = fund.changePercent >= 0;
    return (
      <div key={fund.id} className={`${card} p-5 hover:shadow-md transition-shadow flex flex-col`}>
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="font-serif text-lg leading-snug text-[#1B2B44]">{fund.name}</h3>
            <span className="inline-block mt-1.5 text-[11px] uppercase tracking-wide text-[#8A8371] border border-[#D9D0B8] px-2 py-0.5 rounded">{fund.category}</span>
          </div>
          <div className="flex -mr-2 -mt-1 shrink-0">
            <button aria-label="Watchlist" onClick={() => toggleWatch(fund.id)} className={`p-2.5 rounded-full hover:bg-[#F7F3E9] ${watchlist.includes(fund.id) ? "text-[#B8860B]" : "text-[#9A927B]"}`}>
              <Star size={18} fill={watchlist.includes(fund.id) ? "currentColor" : "none"} />
            </button>
            <button aria-label="Compare" onClick={() => addCompare(fund.id)} disabled={compare.length >= 4 && !compare.includes(fund.id)}
              className={`p-2.5 rounded-full hover:bg-[#F7F3E9] disabled:opacity-40 ${compare.includes(fund.id) ? "text-[#B8860B]" : "text-[#9A927B]"}`}>
              <GitCompare size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif text-3xl tabular-nums">₹{fund.nav.toFixed(2)}</span>
          <span className={`flex items-center gap-1 text-sm font-medium tabular-nums ${up ? "text-[#3F6B4D]" : "text-[#A6432D]"}`}>
            {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {up ? "+" : ""}{fund.changePercent.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-[#E7E0CC] border-y border-[#E7E0CC] py-3 mb-4 text-center">
          {(["1y", "3y", "5y"] as const).map((p) => (
            <div key={p}>
              <div className="text-[11px] uppercase tracking-wide text-[#8A8371]">{p}</div>
              <div className="font-serif text-lg text-[#3F6B4D] tabular-nums">{fund.returns[p]}%</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Stars n={fund.rating} />
          <button onClick={() => setSelected(fund)} className="text-sm font-medium text-[#B8860B] hover:text-[#8F6A08] py-1">View details →</button>
        </div>
      </div>
    );
  };

  const compareData = funds.filter((f) => compare.includes(f.id));
  const compareRows: [string, (f: Fund) => React.ReactNode][] = [
    ["NAV", (f) => `₹${f.nav.toFixed(2)}`], ["Category", (f) => f.category],
    ["1Y return", (f) => `${f.returns["1y"]}%`], ["3Y return", (f) => `${f.returns["3y"]}%`], ["5Y return", (f) => `${f.returns["5y"]}%`],
    ["Expense ratio", (f) => `${f.expenseRatio}%`], ["Risk", (f) => f.riskLevel], ["Min investment", (f) => `₹${f.minInvestment}`],
    ["AUM", (f) => f.aum], ["Rating", (f) => <Stars n={f.rating} />],
  ];

  return (
    <main className="min-h-screen bg-[#F7F3E9] text-[#1B2B44] pt-20 pb-24 px-4 sm:px-6 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center gap-2 bg-[#1B2B44] text-[#F7F3E9] px-4 py-1.5 rounded-t-md text-xs tracking-wide font-medium">
            <Landmark size={14} /> Mutual Funds
          </div>
          <div className="border border-[#D9D0B8] bg-[#FCFAF4] rounded-b-md rounded-tr-md px-5 py-6 sm:px-8 sm:py-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">Find funds worth holding</h1>
                <p className="text-[#5B5540] mt-3 max-w-lg text-sm sm:text-[15px] leading-relaxed">Explore, compare and track funds with live NAV updates.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 md:flex-none border border-[#D9D0B8] rounded-md px-4 py-2 bg-[#F7F3E9]">
                  <p className="text-[10px] uppercase tracking-wide text-[#8A8371]">Portfolio</p>
                  <p className="font-serif text-xl tabular-nums">₹{profile.currentValue.toLocaleString("en-IN")}</p>
                </div>
                <button aria-label="Notifications" onClick={() => setPanel(panel === "notif" ? null : "notif")} className="relative p-3 border border-[#D9D0B8] rounded-md hover:bg-[#F7F3E9]">
                  <Bell size={18} /><span className="absolute top-2 right-2 w-2 h-2 bg-[#A6432D] rounded-full" />
                </button>
                <button aria-label="Profile" onClick={() => setPanel(panel === "profile" ? null : "profile")} className="p-3 border border-[#D9D0B8] rounded-md hover:bg-[#F7F3E9]">
                  <User size={18} />
                </button>
              </div>
            </div>
          </div>

          {panel && (
            <div className={`absolute right-0 top-full mt-2 z-40 w-full sm:w-96 ${card} shadow-xl`}>
              <div className="p-4 border-b border-[#E7E0CC] flex justify-between items-center">
                <h3 className="font-serif text-lg">{panel === "notif" ? "Notifications" : "Profile"}</h3>
                <button aria-label="Close" onClick={() => setPanel(null)} className="p-1"><X size={18} /></button>
              </div>
              {panel === "notif" ? (
                <div className="max-h-80 overflow-y-auto divide-y divide-[#E7E0CC]">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 flex gap-3">
                      <span className={n.type === "success" ? "text-[#3F6B4D]" : n.type === "warning" ? "text-[#B8860B]" : "text-[#1B2B44]"}>
                        {n.type === "success" ? <CheckCircle2 size={18} /> : n.type === "warning" ? <AlertCircle size={18} /> : <Info size={18} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-sm text-[#5B5540] mt-0.5">{n.message}</p>
                        <p className="text-xs text-[#8A8371] mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm divide-y divide-[#E7E0CC]">
                  <div className="pb-3"><p className="font-serif text-lg">{profile.name}</p><p className="text-[#8A8371] break-all">{profile.email}</p></div>
                  <div className="flex justify-between py-3"><span className="text-[#5B5540]">PAN</span><span className="font-medium">{profile.pan}</span></div>
                  <div className="flex justify-between pt-3"><span className="text-[#5B5540]">KYC</span><span className="font-medium text-[#3F6B4D]">{profile.kyc}</span></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["explore", "watchlist"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-md text-sm font-medium capitalize border transition-colors ${tab === t ? "bg-[#1B2B44] text-[#F7F3E9] border-[#1B2B44]" : "bg-[#FCFAF4] text-[#5B5540] border-[#D9D0B8] hover:bg-[#EFE9D8]"}`}>
              {t}{t === "watchlist" ? ` (${watchlist.length})` : ""}
            </button>
          ))}
        </div>

        {tab === "explore" && (
          <div className="mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3.5 text-[#9A927B]" size={18} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mutual funds..." className={`${inputClass} pl-10`} />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className={`${inputClass} sm:w-52`}>
                <option value="returns">Sort by returns</option><option value="nav">Sort by NAV</option>
                <option value="rating">Sort by rating</option><option value="aum">Sort by AUM</option>
              </select>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${cat === c ? "bg-[#B8860B] text-white border-[#B8860B]" : "bg-[#FCFAF4] text-[#5B5540] border-[#D9D0B8] hover:bg-[#EFE9D8]"}`}>
                  {c === "all" ? "All funds" : c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl sm:text-2xl">{shown.length} fund{shown.length !== 1 && "s"}</h2>
          <div className="flex items-center gap-1.5 text-xs text-[#8A8371]"><RefreshCw size={12} />{lastUpdate?.toLocaleTimeString() ?? ""}</div>
        </div>

        {shown.length === 0 ? (
          <div className={`${card} text-center py-12 px-4`}>
            <Star size={36} className="mx-auto text-[#D9D0B8] mb-3" />
            <p className="text-sm text-[#8A8371]">{tab === "watchlist" ? "No funds in your watchlist yet." : "No funds match your search."}</p>
            {tab === "watchlist" && <button onClick={() => setTab("explore")} className="mt-3 text-sm font-medium text-[#B8860B]">Explore funds</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">{shown.map(FundCard)}</div>
        )}

        <div className={`mt-10 ${card} px-5 py-4`}>
          <p className="text-xs text-[#8A8371] leading-relaxed">Mutual fund investments are subject to market risks. Past performance does not guarantee future returns. Figures shown are illustrative.</p>
        </div>
      </div>

      {/* Floating compare bar */}
      {compare.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-40 flex justify-center">
          <button onClick={() => setShowCompare(true)} className="flex items-center gap-2 px-6 py-3.5 bg-[#1B2B44] text-[#F7F3E9] rounded-md shadow-xl font-medium hover:bg-[#243A5E]">
            <GitCompare size={17} /> Compare ({compare.length})
          </button>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="p-5 sm:p-8">
            <div className="flex justify-between items-start gap-3 mb-6">
              <div className="min-w-0">
                <h2 className="font-serif text-2xl sm:text-3xl leading-tight">{selected.name}</h2>
                <span className="inline-block mt-2 text-[11px] uppercase tracking-wide text-[#8A8371] border border-[#D9D0B8] px-2 py-0.5 rounded">{selected.category}</span>
              </div>
              <button aria-label="Close" onClick={() => setSelected(null)} className="p-2 -mr-2 -mt-2"><X size={22} /></button>
            </div>
            <div className="grid grid-cols-2 border border-[#D9D0B8] rounded-md divide-x divide-[#D9D0B8] mb-6">
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wide text-[#8A8371]">Current NAV</p>
                <p className="font-serif text-2xl tabular-nums">₹{selected.nav.toFixed(2)}</p>
                <p className={`text-xs ${selected.changePercent >= 0 ? "text-[#3F6B4D]" : "text-[#A6432D]"}`}>{selected.changePercent >= 0 ? "+" : ""}{selected.changePercent.toFixed(2)}% today</p>
              </div>
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wide text-[#8A8371]">Fund manager</p>
                <p className="font-serif text-lg leading-snug">{selected.fundManager}</p>
                <p className="text-xs text-[#8A8371]">{selected.aum} AUM</p>
              </div>
            </div>
            <h3 className="font-serif text-lg mb-2">Returns</h3>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-6">
              {(["1m", "6m", "1y", "3y", "5y"] as const).map((p) => (
                <div key={p} className="text-center py-3 border border-[#D9D0B8] rounded-md bg-[#F7F3E9]">
                  <p className="text-[10px] uppercase text-[#8A8371]">{p}</p>
                  <p className="font-serif text-base sm:text-lg text-[#3F6B4D] tabular-nums">{selected.returns[p]}%</p>
                </div>
              ))}
            </div>
            <div className="divide-y divide-[#E7E0CC] text-sm mb-6">
              {([["Benchmark", selected.benchmarkIndex], ["Expense ratio", `${selected.expenseRatio}%`], ["Minimum investment", `₹${selected.minInvestment}`],
                ["Risk level", selected.riskLevel], ["Exit load", selected.exitLoad], ["Lock-in", selected.lockInPeriod]] as const).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3"><span className="text-[#5B5540]">{k}</span><span className="font-medium text-right">{v}</span></div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setInvest("lumpsum")} className="py-3 rounded-md bg-[#1B2B44] text-[#F7F3E9] font-medium hover:bg-[#243A5E]">Invest now</button>
              <button onClick={() => setInvest("sip")} className="py-3 rounded-md border border-[#1B2B44] text-[#1B2B44] font-medium hover:bg-[#EFE9D8]">Start SIP</button>
              <button onClick={() => { addCompare(selected.id); setSelected(null); }} className="col-span-2 py-3 rounded-md border border-[#D9D0B8] text-[#5B5540] font-medium hover:bg-[#EFE9D8] flex items-center justify-center gap-2">
                <GitCompare size={17} /> Add to compare
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Compare modal */}
      {showCompare && (
        <Modal wide onClose={() => setShowCompare(false)}>
          <div className="p-5 sm:p-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-serif text-2xl sm:text-3xl">Compare funds</h2>
              <button aria-label="Close" onClick={() => setShowCompare(false)} className="p-2 -mr-2"><X size={22} /></button>
            </div>
            <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b-2 border-[#D9D0B8]">
                    <th className="sticky left-0 bg-[#FCFAF4] text-left py-3 pr-4 text-xs uppercase tracking-wide text-[#8A8371] font-medium">Metric</th>
                    {compareData.map((f) => (
                      <th key={f.id} className="text-left py-3 px-3 align-top min-w-[140px]">
                        <div className="font-serif text-base leading-snug">{f.name}</div>
                        <button onClick={() => setCompare((p) => p.filter((x) => x !== f.id))} className="text-xs text-[#A6432D] mt-1">Remove</button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E0CC]">
                  {compareRows.map(([label, get]) => (
                    <tr key={label}>
                      <td className="sticky left-0 bg-[#FCFAF4] py-3 pr-4 text-[#5B5540] whitespace-nowrap">{label}</td>
                      {compareData.map((f) => <td key={f.id} className="py-3 px-3 tabular-nums">{get(f)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Invest sheet */}
      {invest && (
        <Modal onClose={() => setInvest(null)}>
          <div className="p-5 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl">{invest === "lumpsum" ? "One-time investment" : "Start SIP"}</h3>
              <button aria-label="Close" onClick={() => setInvest(null)} className="p-2 -mr-2"><X size={22} /></button>
            </div>
            <label className="block text-xs uppercase tracking-wide text-[#8A8371] mb-2">Amount (₹){invest === "sip" ? " per month" : ""}</label>
            <input type="number" inputMode="numeric" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className={`${inputClass} text-xl font-serif`} />
            <div className="flex gap-2 mt-3 flex-wrap">
              {[1000, 5000, 10000, 25000].map((a) => (
                <button key={a} onClick={() => setAmount(a)} className="px-3 py-1.5 text-sm border border-[#D9D0B8] rounded-full hover:bg-[#EFE9D8]">₹{a.toLocaleString("en-IN")}</button>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-[#1B2B44] text-[#F7F3E9] rounded-md font-medium hover:bg-[#243A5E]">Proceed to payment</button>
          </div>
        </Modal>
      )}
    </main>
  );
}