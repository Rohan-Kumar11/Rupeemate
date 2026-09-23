"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileStack,
  Plus,
  Trash2,
  Stamp,
  ScrollText,
} from "lucide-react";

// If you keep a shared types file, move this into it (e.g. "@/types/financial").
// Left local here so this file drops in standalone.
export type TaxRecord = {
  id: string;
  income_source: string;
  income_amount: number;
  date: string;
  category: string;
  platform?: string;
  document_status: "available" | "missing" | "not_applicable";
  notes?: string;
};

export type TaxChecklist = {
  incomeRecordsAvailable: boolean;
  platformStatementsAvailable: boolean;
  bankRecordsOrganized: boolean;
  documentsCollected: boolean;
  expenseRecordsOrganized: boolean;
};

const defaultRecords: TaxRecord[] = [
  {
    id: "tax-1",
    income_source: "Delivery",
    income_amount: 18000,
    date: "2026-09-01",
    category: "Gig Income",
    platform: "Delivery Platform",
    document_status: "available",
    notes: "Monthly delivery income",
  },
  {
    id: "tax-2",
    income_source: "Freelance",
    income_amount: 12000,
    date: "2026-09-10",
    category: "Freelance Income",
    platform: "Freelance Platform",
    document_status: "missing",
    notes: "Statement needs to be collected",
  },
];

const defaultChecklist: TaxChecklist = {
  incomeRecordsAvailable: true,
  platformStatementsAvailable: false,
  bankRecordsOrganized: false,
  documentsCollected: false,
  expenseRecordsOrganized: false,
};

const checklistItems: { key: keyof TaxChecklist; label: string }[] = [
  { key: "incomeRecordsAvailable", label: "Income records logged" },
  { key: "platformStatementsAvailable", label: "Platform statements pulled" },
  { key: "bankRecordsOrganized", label: "Bank records reconciled" },
  { key: "documentsCollected", label: "Supporting documents collected" },
  { key: "expenseRecordsOrganized", label: "Expense records itemized" },
];

const statusStyles: Record<TaxRecord["document_status"], { label: string; dot: string; text: string }> = {
  available: { label: "On file", dot: "bg-[#3F6B4D]", text: "text-[#3F6B4D]" },
  missing: { label: "Missing", dot: "bg-[#A6432D]", text: "text-[#A6432D]" },
  not_applicable: { label: "N/A", dot: "bg-[#8A8371]", text: "text-[#8A8371]" },
};

const inputClass =
  "w-full bg-[#FCFAF4] border border-[#D9D0B8] rounded-md px-3.5 py-2.5 text-[#1B2B44] placeholder:text-[#9A927B] focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 transition-colors font-sans text-sm";

export default function TaxCenterPage() {
  const [records, setRecords] = useState<TaxRecord[]>([]);
  const [checklist, setChecklist] = useState<TaxChecklist>(defaultChecklist);
  const [showForm, setShowForm] = useState(false);

  const [incomeSource, setIncomeSource] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Gig Income");
  const [platform, setPlatform] = useState("");
  const [documentStatus, setDocumentStatus] = useState<TaxRecord["document_status"]>("available");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const storedRecords = localStorage.getItem("rupeemate_tax_records");
    const storedChecklist = localStorage.getItem("rupeemate_tax_checklist");

    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    } else {
      localStorage.setItem("rupeemate_tax_records", JSON.stringify(defaultRecords));
      setRecords(defaultRecords);
    }

    if (storedChecklist) {
      setChecklist(JSON.parse(storedChecklist));
    } else {
      localStorage.setItem("rupeemate_tax_checklist", JSON.stringify(defaultChecklist));
      setChecklist(defaultChecklist);
    }
  }, []);

  const saveRecords = (updated: TaxRecord[]) => {
    setRecords(updated);
    localStorage.setItem("rupeemate_tax_records", JSON.stringify(updated));
  };

  const saveChecklist = (updated: TaxChecklist) => {
    setChecklist(updated);
    localStorage.setItem("rupeemate_tax_checklist", JSON.stringify(updated));
  };

  const addRecord = () => {
    if (!incomeSource || !incomeAmount || !date) return;
    const newRecord: TaxRecord = {
      id: crypto.randomUUID(),
      income_source: incomeSource,
      income_amount: Number(incomeAmount),
      date,
      category,
      platform: platform || undefined,
      document_status: documentStatus,
      notes: notes || undefined,
    };
    saveRecords([...records, newRecord]);
    setIncomeSource("");
    setIncomeAmount("");
    setDate("");
    setCategory("Gig Income");
    setPlatform("");
    setDocumentStatus("available");
    setNotes("");
    setShowForm(false);
  };

  const deleteRecord = (id: string) => saveRecords(records.filter((r) => r.id !== id));

  const totalIncome = useMemo(
    () => records.reduce((t, r) => t + Number(r.income_amount || 0), 0),
    [records]
  );

  const missingDocuments = useMemo(
    () => records.filter((r) => r.document_status === "missing").length,
    [records]
  );

  const categories = useMemo(() => {
    const result: Record<string, number> = {};
    records.forEach((r) => (result[r.category] = (result[r.category] || 0) + r.income_amount));
    return result;
  }, [records]);

  const completedChecklist = Object.values(checklist).filter(Boolean).length;
  const checklistProgress = Math.round((completedChecklist / checklistItems.length) * 100);

  const reminders: string[] = [];
  if (missingDocuments > 0) reminders.push(`${missingDocuments} record(s) are missing supporting documents.`);
  if (records.length > 1 && new Set(records.map((r) => r.income_source)).size > 1) {
    reminders.push("Multiple income sources on file — keep each one reconciled separately.");
  }
  if (!checklist.platformStatementsAvailable) reminders.push("Pull platform statements before filing season.");
  if (!checklist.bankRecordsOrganized) reminders.push("Bank records still need reconciling.");
  if (reminders.length === 0) reminders.push("Nothing outstanding — records are in good shape.");

  return (
    <main className="min-h-screen bg-[#F7F3E9] text-[#1B2B44] pt-20 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Folder-tab header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#1B2B44] text-[#F7F3E9] px-4 py-1.5 rounded-t-md text-xs tracking-wide font-medium">
            <ScrollText size={14} />
            Tax Center
          </div>
          <div className="border border-[#D9D0B8] bg-[#FCFAF4] rounded-b-md rounded-tr-md px-8 py-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl text-[#1B2B44] leading-tight">
                  Your income, filed and in order
                </h1>
                <p className="text-[#5B5540] mt-3 max-w-lg text-[15px] leading-relaxed">
                  Every gig payout logged in one ledger, so filing season is a formality —
                  not a scramble through app screenshots.
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1B2B44] text-[#F7F3E9] font-medium rounded-md hover:bg-[#243A5E] transition-colors whitespace-nowrap"
              >
                <Plus size={17} />
                Log income
              </button>
            </div>
          </div>
        </div>

        {/* Ledger summary strip */}
        <div className="grid sm:grid-cols-3 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] mb-10 divide-y sm:divide-y-0 sm:divide-x divide-[#D9D0B8]">
          <div className="p-6">
            <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Recorded income</p>
            <p className="font-serif text-3xl text-[#1B2B44] tabular-nums">
              ₹{totalIncome.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-[#8A8371] mt-1">{records.length} entries this cycle</p>
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Needs a document</p>
            <p className="font-serif text-3xl text-[#A6432D] tabular-nums">{missingDocuments}</p>
            <p className="text-sm text-[#8A8371] mt-1">records awaiting proof</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-[#8A8371]">Filing readiness</p>
              <Stamp size={14} className="text-[#B8860B]" />
            </div>
            <p className="font-serif text-3xl text-[#1B2B44] tabular-nums">{checklistProgress}%</p>
            <div className="h-1.5 bg-[#EFE9D8] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#B8860B] rounded-full transition-all duration-500"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          </div>
        </div>

        {showForm && (
          <div className="mb-10 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-8">
            <h2 className="font-serif text-2xl text-[#1B2B44] mb-6">New ledger entry</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} placeholder="Source, e.g. Delivery" className={inputClass} />
              <input type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} placeholder="Amount received" className={inputClass} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
              <input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Platform, e.g. Swiggy / Uber" className={inputClass} />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                <option>Gig Income</option>
                <option>Freelance Income</option>
                <option>Driving Income</option>
                <option>Delivery Income</option>
                <option>Other Income</option>
              </select>
              <select value={documentStatus} onChange={(e) => setDocumentStatus(e.target.value as TaxRecord["document_status"])} className={inputClass}>
                <option value="available">Document on file</option>
                <option value="missing">Document missing</option>
                <option value="not_applicable">Not applicable</option>
              </select>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className={`${inputClass} md:col-span-2 min-h-20`} />
            </div>
            <button onClick={addRecord} className="mt-6 px-6 py-2.5 bg-[#1B2B44] text-[#F7F3E9] rounded-md font-medium hover:bg-[#243A5E] transition-colors">
              Add to ledger
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ledger rows */}
          <div className="lg:col-span-2 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-8">
            <div className="flex items-center gap-2 mb-6">
              <FileStack size={18} className="text-[#B8860B]" />
              <h2 className="font-serif text-2xl text-[#1B2B44]">Income ledger</h2>
            </div>

            {records.length === 0 ? (
              <p className="text-[#8A8371] text-sm">No entries yet. Log your first income record above.</p>
            ) : (
              <div className="divide-y divide-[#E7E0CC]">
                {records.map((record) => {
                  const status = statusStyles[record.document_status];
                  return (
                    <div key={record.id} className="py-5 group">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span className="font-serif text-lg text-[#1B2B44] truncate">{record.income_source}</span>
                          <span className="flex-1 border-b border-dotted border-[#C9BF9F] mx-2 min-w-[24px]" />
                        </div>
                        <span className="font-serif text-lg tabular-nums text-[#1B2B44] whitespace-nowrap">
                          ₹{record.income_amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-[#8A8371]">
                          {record.category}
                          {record.platform ? ` · ${record.platform}` : ""} · {record.date}
                        </p>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                      {record.notes && <p className="text-sm text-[#5B5540] mt-2">{record.notes}</p>}
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="mt-2 text-[#A6432D] hover:text-[#7E3120] text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                        Remove entry
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-6">
              <h2 className="font-serif text-xl text-[#1B2B44] mb-4">Filing checklist</h2>
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={(e) => saveChecklist({ ...checklist, [item.key]: e.target.checked })}
                      className="w-4 h-4 mt-0.5 accent-[#B8860B]"
                    />
                    <span className={`text-sm ${checklist[item.key] ? "text-[#8A8371] line-through" : "text-[#1B2B44]"} group-hover:text-[#B8860B] transition-colors`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={17} className="text-[#B8860B]" />
                <h2 className="font-serif text-xl text-[#1B2B44]">Reminders</h2>
              </div>
              <div className="space-y-2.5">
                {reminders.map((reminder, i) => (
                  <div key={i} className="text-sm text-[#4A4433] border-l-2 border-[#B8860B] pl-3 py-0.5">
                    {reminder}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#D9D0B8] rounded-md bg-[#FCFAF4] p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={17} className="text-[#3F6B4D]" />
                <h2 className="font-serif text-xl text-[#1B2B44]">By category</h2>
              </div>
              <div className="space-y-2.5">
                {Object.entries(categories).map(([name, amount]) => (
                  <div key={name} className="flex justify-between text-sm">
                    <span className="text-[#5B5540]">{name}</span>
                    <span className="font-medium text-[#1B2B44] tabular-nums">₹{amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
                {Object.keys(categories).length === 0 && (
                  <p className="text-sm text-[#8A8371]">No category data yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border border-[#D9D0B8] rounded-md bg-[#FCFAF4] px-5 py-4">
          <p className="text-xs text-[#8A8371] leading-relaxed">
            RupeeMate Tax Center helps you organize income records and stay filing-ready. It does not
            calculate or determine official tax liability and does not replace professional tax advice.
          </p>
        </div>
      </div>
    </main>
  );
}