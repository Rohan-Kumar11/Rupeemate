"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  Plus,
  Trash2,
} from "lucide-react";
import type { TaxRecord, TaxChecklist } from "@/types/financial";

const demoRecords: TaxRecord[] = [
  {
    id: "income-1",
    income_source: "Delivery",
    income_amount: 18000,
    date: "2026-09-05",
    category: "Gig Income",
    platform: "Delivery Platform",
    document_status: "available",
    notes: "Monthly delivery income",
  },
  {
    id: "income-2",
    income_source: "Freelance",
    income_amount: 12000,
    date: "2026-09-10",
    category: "Freelance",
    platform: "Direct Client",
    document_status: "missing",
    notes: "Invoice/record needs attention",
  },
];

const defaultChecklist: TaxChecklist = {
  incomeRecordsAvailable: true,
  platformStatementsAvailable: false,
  bankRecordsOrganized: true,
  documentsCollected: false,
  expenseRecordsOrganized: false,
};

export default function TaxCenterPage() {
  const [records, setRecords] = useState<TaxRecord[]>([]);
  const [checklist, setChecklist] =
    useState<TaxChecklist>(defaultChecklist);

  const [showForm, setShowForm] = useState(false);
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Gig Income");
  const [platform, setPlatform] = useState("");
  const [documentStatus, setDocumentStatus] =
    useState<TaxRecord["document_status"]>("available");

  useEffect(() => {
    const savedRecords = localStorage.getItem("rupeemate_tax_records");
    const savedChecklist = localStorage.getItem("rupeemate_tax_checklist");

    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    } else {
      setRecords(demoRecords);
      localStorage.setItem(
        "rupeemate_tax_records",
        JSON.stringify(demoRecords)
      );
    }

    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
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

  const totalIncome = useMemo(
    () =>
      records.reduce(
        (total, record) => total + record.income_amount,
        0
      ),
    [records]
  );

  const incomeSources = new Set(
    records.map((record) => record.income_source)
  );

  const missingDocuments = records.filter(
    (record) => record.document_status === "missing"
  ).length;

  const checklistItems = [
    {
      key: "incomeRecordsAvailable",
      label: "Income records available",
    },
    {
      key: "platformStatementsAvailable",
      label: "Platform statements available",
    },
    {
      key: "bankRecordsOrganized",
      label: "Relevant bank records organized",
    },
    {
      key: "documentsCollected",
      label: "Relevant documents collected",
    },
    {
      key: "expenseRecordsOrganized",
      label: "Expense records organized",
    },
  ] as const;

  const completedChecklist = checklistItems.filter(
    (item) => checklist[item.key]
  ).length;

  const addRecord = () => {
    if (!source || !amount) return;

    const record: TaxRecord = {
      id: crypto.randomUUID(),
      income_source: source,
      income_amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
      category,
      platform,
      document_status: documentStatus,
    };

    saveRecords([...records, record]);

    setSource("");
    setAmount("");
    setPlatform("");
    setDocumentStatus("available");
    setShowForm(false);
  };

  const deleteRecord = (id: string) => {
    saveRecords(records.filter((record) => record.id !== id));
  };

  const toggleChecklist = (key: keyof TaxChecklist) => {
    saveChecklist({
      ...checklist,
      [key]: !checklist[key],
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Tax Center</h1>
            <p className="text-slate-400 mt-2">
              Organize income records and stay tax-ready.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 px-5 py-3 rounded-xl font-semibold"
          >
            <Plus size={20} />
            Add Income
          </button>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <IndianRupee className="text-emerald-400 mb-3" />
            <p className="text-slate-400 text-sm">
              Recorded Income
            </p>
            <p className="text-2xl font-bold">
              ₹{totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <FileCheck className="text-blue-400 mb-3" />
            <p className="text-slate-400 text-sm">
              Income Records
            </p>
            <p className="text-2xl font-bold">
              {records.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <AlertTriangle className="text-yellow-400 mb-3" />
            <p className="text-slate-400 text-sm">
              Missing Documents
            </p>
            <p className="text-2xl font-bold">
              {missingDocuments}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <CheckCircle2 className="text-emerald-400 mb-3" />
            <p className="text-slate-400 text-sm">
              Checklist
            </p>
            <p className="text-2xl font-bold">
              {completedChecklist}/{checklistItems.length}
            </p>
          </div>

        </div>

        {/* Attention Alert */}
        {(missingDocuments > 0 || incomeSources.size > 1) && (
          <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <div className="flex gap-3">
              <AlertTriangle className="text-yellow-400 shrink-0" />

              <div>
                <h2 className="font-bold text-yellow-300">
                  Records Need Attention
                </h2>

                {incomeSources.size > 1 && (
                  <p className="text-slate-300 text-sm mt-1">
                    Multiple income sources detected. Keep records
                    organized across all sources.
                  </p>
                )}

                {missingDocuments > 0 && (
                  <p className="text-slate-300 text-sm mt-1">
                    {missingDocuments} income record(s) have missing
                    document information.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add income */}
        {showForm && (
          <div className="mb-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h2 className="text-xl font-bold mb-5">
              Add Income Record
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Income source e.g. Delivery"
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              />

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Income amount"
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              />

              <input
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Platform / client"
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              />

              <select
                value={documentStatus}
                onChange={(e) =>
                  setDocumentStatus(
                    e.target.value as TaxRecord["document_status"]
                  )
                }
                className="bg-slate-800 border border-slate-700 rounded-lg p-3"
              >
                <option value="available">
                  Document Available
                </option>
                <option value="missing">
                  Document Missing
                </option>
                <option value="not_applicable">
                  Not Applicable
                </option>
              </select>

            </div>

            <button
              onClick={addRecord}
              className="mt-5 bg-emerald-500 hover:bg-emerald-400 px-6 py-3 rounded-lg font-semibold"
            >
              Save Income Record
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Income records */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-5">
              Income Records
            </h2>

            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex justify-between items-center bg-slate-800/60 rounded-xl p-4"
                >
                  <div>
                    <p className="font-semibold">
                      {record.income_source}
                    </p>

                    <p className="text-xs text-slate-400">
                      {record.platform || "Platform not specified"}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {record.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ₹{record.income_amount.toLocaleString()}
                    </p>

                    <p
                      className={`text-xs ${
                        record.document_status === "missing"
                          ? "text-yellow-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {record.document_status === "missing"
                        ? "Document missing"
                        : "Record ready"}
                    </p>

                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-400 mt-2"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-5">
              Tax-Readiness Checklist
            </h2>

            <div className="space-y-3">
              {checklistItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleChecklist(item.key)}
                  className="w-full flex items-center gap-3 bg-slate-800/60 rounded-xl p-4 text-left"
                >
                  {checklist[item.key] ? (
                    <CheckCircle2 className="text-emerald-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-600" />
                  )}

                  <span
                    className={
                      checklist[item.key]
                        ? "text-white"
                        : "text-slate-400"
                    }
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-300 font-semibold">
                Tax-readiness assistant
              </p>

              <p className="text-sm text-slate-400 mt-1">
                This module organizes records and documents for
                review. It does not calculate or determine official
                tax liability.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}