"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";

import type { TaxRecord, TaxChecklist } from "@/types/financial";

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

export default function TaxPage() {
  const [records, setRecords] = useState<TaxRecord[]>([]);
  const [checklist, setChecklist] =
    useState<TaxChecklist>(defaultChecklist);
  const [showForm, setShowForm] = useState(false);

  const [incomeSource, setIncomeSource] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Gig Income");
  const [platform, setPlatform] = useState("");
  const [documentStatus, setDocumentStatus] =
    useState<TaxRecord["document_status"]>("available");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const storedRecords = localStorage.getItem("rupeemate_tax_records");
    const storedChecklist = localStorage.getItem("rupeemate_tax_checklist");

    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    } else {
      localStorage.setItem(
        "rupeemate_tax_records",
        JSON.stringify(defaultRecords)
      );
      setRecords(defaultRecords);
    }

    if (storedChecklist) {
      setChecklist(JSON.parse(storedChecklist));
    } else {
      localStorage.setItem(
        "rupeemate_tax_checklist",
        JSON.stringify(defaultChecklist)
      );
      setChecklist(defaultChecklist);
    }
  }, []);

  const saveRecords = (updated: TaxRecord[]) => {
    setRecords(updated);
    localStorage.setItem(
      "rupeemate_tax_records",
      JSON.stringify(updated)
    );
  };

  const saveChecklist = (updated: TaxChecklist) => {
    setChecklist(updated);
    localStorage.setItem(
      "rupeemate_tax_checklist",
      JSON.stringify(updated)
    );
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

  const deleteRecord = (id: string) => {
    saveRecords(records.filter((record) => record.id !== id));
  };

  const totalIncome = useMemo(
    () =>
      records.reduce(
        (total, record) => total + Number(record.income_amount || 0),
        0
      ),
    [records]
  );

  const missingDocuments = useMemo(
    () =>
      records.filter(
        (record) => record.document_status === "missing"
      ).length,
    [records]
  );

  const categories = useMemo(() => {
    const result: Record<string, number> = {};

    records.forEach((record) => {
      result[record.category] =
        (result[record.category] || 0) + record.income_amount;
    });

    return result;
  }, [records]);

  const checklistItems = [
    {
      key: "incomeRecordsAvailable" as const,
      label: "Income records available",
    },
    {
      key: "platformStatementsAvailable" as const,
      label: "Platform statements available",
    },
    {
      key: "bankRecordsOrganized" as const,
      label: "Relevant bank records organized",
    },
    {
      key: "documentsCollected" as const,
      label: "Required documents collected",
    },
    {
      key: "expenseRecordsOrganized" as const,
      label: "Expense records organized",
    },
  ];

  const completedChecklist = Object.values(checklist).filter(
    Boolean
  ).length;

  const checklistProgress = Math.round(
    (completedChecklist / checklistItems.length) * 100
  );

  const reminders: string[] = [];

  if (missingDocuments > 0) {
    reminders.push(
      `${missingDocuments} income record(s) need document attention.`
    );
  }

  if (records.length > 1) {
    const uniqueSources = new Set(
      records.map((record) => record.income_source)
    );

    if (uniqueSources.size > 1) {
      reminders.push(
        "You have income from multiple sources. Keep records organized."
      );
    }
  }

  if (!checklist.platformStatementsAvailable) {
    reminders.push("Review platform statements before tax preparation.");
  }

  if (!checklist.bankRecordsOrganized) {
    reminders.push("Review and organize relevant bank records.");
  }

  if (reminders.length === 0) {
    reminders.push("No immediate tax-record reminder.");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Tax Center</h1>
            <p className="text-slate-400 mt-2">
              Organize income records and stay tax-ready.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 px-5 py-3 rounded-xl font-semibold"
          >
            <Plus size={20} />
            Add Income Record
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="text-emerald-400" />
              <span className="text-slate-400">Recorded Income</span>
            </div>

            <p className="text-3xl font-bold">
              ₹{totalIncome.toLocaleString()}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Across {records.length} record(s)
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="text-blue-400" />
              <span className="text-slate-400">
                Records Needing Attention
              </span>
            </div>

            <p className="text-3xl font-bold">
              {missingDocuments}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Missing document records
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="text-emerald-400" />
              <span className="text-slate-400">
                Readiness Checklist
              </span>
            </div>

            <p className="text-3xl font-bold">
              {checklistProgress}%
            </p>

            <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Record Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-2xl bg-slate-900 border border-slate-700">
            <h2 className="text-xl font-bold mb-5">
              Add Income Record
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={incomeSource}
                onChange={(e) => setIncomeSource(e.target.value)}
                placeholder="Income source e.g. Delivery"
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              />

              <input
                type="number"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                placeholder="Income amount"
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              />

              <input
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Platform e.g. Swiggy / Uber / Freelance"
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              >
                <option>Gig Income</option>
                <option>Freelance Income</option>
                <option>Driving Income</option>
                <option>Delivery Income</option>
                <option>Other Income</option>
              </select>

              <select
                value={documentStatus}
                onChange={(e) =>
                  setDocumentStatus(
                    e.target.value as TaxRecord["document_status"]
                  )
                }
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              >
                <option value="available">Document Available</option>
                <option value="missing">Document Missing</option>
                <option value="not_applicable">
                  Not Applicable
                </option>
              </select>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
                className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-3 min-h-24"
              />
            </div>

            <button
              onClick={addRecord}
              className="mt-5 bg-emerald-500 hover:bg-emerald-400 px-6 py-3 rounded-lg font-semibold"
            >
              Save Income Record
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Income Records */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-5">
              Income Records
            </h2>

            {records.length === 0 ? (
              <p className="text-slate-400">
                No income records added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="border border-slate-800 rounded-xl p-4"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">
                          {record.income_source}
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                          {record.category}
                          {record.platform
                            ? ` · ${record.platform}`
                            : ""}
                        </p>

                        <p className="text-xs text-slate-500 mt-2">
                          {record.date}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₹{record.income_amount.toLocaleString()}
                        </p>

                        <span
                          className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                            record.document_status === "available"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : record.document_status === "missing"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {record.document_status === "available"
                            ? "Document Available"
                            : record.document_status === "missing"
                            ? "Document Missing"
                            : "Not Applicable"}
                        </span>
                      </div>
                    </div>

                    {record.notes && (
                      <p className="text-sm text-slate-400 mt-3">
                        {record.notes}
                      </p>
                    )}

                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="mt-3 text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tax Readiness */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-5">
                Tax Readiness
              </h2>

              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={(e) =>
                        saveChecklist({
                          ...checklist,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-emerald-500"
                    />

                    <span className="text-sm text-slate-300">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reminders */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-amber-400" />
                <h2 className="text-xl font-bold">
                  Tax Reminders
                </h2>
              </div>

              <div className="space-y-3">
                {reminders.map((reminder, index) => (
                  <div
                    key={index}
                    className="text-sm text-slate-300 bg-slate-800/60 rounded-lg p-3"
                  >
                    {reminder}
                  </div>
                ))}
              </div>
            </div>

            {/* Income Categories */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">
                Income Categories
              </h2>

              <div className="space-y-3">
                {Object.entries(categories).map(
                  ([categoryName, amount]) => (
                    <div
                      key={categoryName}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-slate-400">
                        {categoryName}
                      </span>

                      <span className="font-semibold">
                        ₹{amount.toLocaleString()}
                      </span>
                    </div>
                  )
                )}

                {Object.keys(categories).length === 0 && (
                  <p className="text-sm text-slate-500">
                    No category data yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs text-slate-500">
            RupeeMate Tax Center is a tax-readiness and record-organization
            assistant. It does not calculate or determine official tax
            liability and does not replace professional tax advice.
          </p>
        </div>
      </div>
    </main>
  );
}