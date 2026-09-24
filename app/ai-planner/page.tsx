"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Target,
  FileText,
  AlertTriangle,
} from "lucide-react";

// ── Ledger palette (matches Tax Center / Manager / Navbar) ──
const INK = "#1B2B44";
const PAPER = "#FCFAF4";
const CANVAS = "#F7F3E9";
const LINE = "#D9D0B8";
const AMBER = "#B8860B";
const TEAL = "#3F6B4D";
const ROSE = "#A6432D";
const MUTED = "#8A8371";
const INK_SOFT = "#5B5540";

const AIChatbotPage: React.FC = () => {
  const [planningData, setPlanningData] = useState<{
    goals: any[];
    priorityGoal: any | null;
    totalIncome: number;
    missingDocuments: number;
    checklistProgress: number;
  }>({
    goals: [],
    priorityGoal: null,
    totalIncome: 0,
    missingDocuments: 0,
    checklistProgress: 0,
  });

  // Load Goals + Tax data from RupeeMate localStorage
  useEffect(() => {
    try {
      const goalsStored = localStorage.getItem("rupeemate_goals");
      const taxStored = localStorage.getItem("rupeemate_tax_records");
      const checklistStored = localStorage.getItem(
        "rupeemate_tax_checklist"
      );

      const goals = goalsStored ? JSON.parse(goalsStored) : [];
      const taxRecords = taxStored ? JSON.parse(taxStored) : [];
      const checklist = checklistStored
        ? JSON.parse(checklistStored)
        : {};

      const activeGoals = goals.filter(
        (goal: any) => goal.status === "active"
      );

      const priorityGoal =
        activeGoals.find(
          (goal: any) => goal.priority === "High"
        ) ||
        activeGoals[0] ||
        null;

      const totalIncome = taxRecords.reduce(
        (total: number, record: any) =>
          total + Number(record.income_amount || 0),
        0
      );

      const missingDocuments = taxRecords.filter(
        (record: any) =>
          record.document_status === "missing"
      ).length;

      const checklistKeys = [
        "incomeRecordsAvailable",
        "platformStatementsAvailable",
        "bankRecordsOrganized",
        "documentsCollected",
        "expenseRecordsOrganized",
      ];

      const completedChecklist = checklistKeys.filter(
        (key) => checklist[key] === true
      ).length;

      const checklistProgress = Math.round(
        (completedChecklist / checklistKeys.length) * 100
      );

      setPlanningData({
        goals,
        priorityGoal,
        totalIncome,
        missingDocuments,
        checklistProgress,
      });
    } catch (error) {
      console.error("Unable to load financial planning data:", error);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: CANVAS }}>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 relative overflow-hidden">

        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ backgroundColor: AMBER }}></div>

        <div className="absolute top-40 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: TEAL }}></div>

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="text-center space-y-6 mb-12">

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-sm text-sm font-semibold" style={{ backgroundColor: PAPER, color: INK, border: `1px solid ${LINE}` }}>
              <Brain size={16} className="animate-pulse" style={{ color: AMBER }} />
              <span>AI-Powered Financial Assistant</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight" style={{ color: INK }}>
              Your Personal{" "}
              <span style={{ color: AMBER }}>
                AI Investment Advisor
              </span>
            </h1>

            <p className="text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: INK_SOFT }}>
              Get instant answers to your financial questions. Our AI-powered
              chatbot provides personalized investment advice, savings
              strategies, and financial planning guidance 24/7.
            </p>

            {/* Feature Pills */}
            <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">

              <div className="flex items-center gap-2 px-4 py-2 rounded-md shadow-sm" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>
                <Zap style={{ color: AMBER }} size={18} />
                <span className="text-sm font-medium" style={{ color: INK }}>
                  Instant Responses
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-md shadow-sm" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>
                <Shield style={{ color: TEAL }} size={18} />
                <span className="text-sm font-medium" style={{ color: INK }}>
                  Secure & Private
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-md shadow-sm" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>
                <MessageSquare style={{ color: INK }} size={18} />
                <span className="text-sm font-medium" style={{ color: INK }}>
                  24/7 Available
                </span>
              </div>

            </div>
          </div>


          {/* ================= FINANCIAL PLAN CONTEXT ================= */}

          <div className="max-w-5xl mx-auto mb-8">

            <div className="rounded-md shadow-sm p-6" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>

              <div className="flex items-center gap-3 mb-6">

                <div className="w-11 h-11 rounded-md flex items-center justify-center" style={{ backgroundColor: INK }}>
                  <Brain style={{ color: PAPER }} size={21} />
                </div>

                <div>
                  <h2 className="font-serif text-xl" style={{ color: INK }}>
                    Your Financial Plan
                  </h2>

                  <p className="text-sm" style={{ color: MUTED }}>
                    Live context from your RupeeMate goals and tax records
                  </p>
                </div>

              </div>


              {planningData.priorityGoal ? (

                <div className="grid md:grid-cols-2 gap-5">

                  {/* Priority Goal */}
                  <div className="rounded-md p-5" style={{ backgroundColor: CANVAS, border: `1px solid ${LINE}` }}>

                    <div className="flex items-center gap-2 mb-3">
                      <Target style={{ color: TEAL }} size={20} />

                      <span className="text-sm font-semibold" style={{ color: TEAL }}>
                        Priority Goal
                      </span>
                    </div>

                    <h3 className="font-serif text-xl" style={{ color: INK }}>
                      {planningData.priorityGoal.name}
                    </h3>

                    <div className="mt-3 space-y-1 text-sm" style={{ color: INK_SOFT }}>

                      <p>
                        Saved: ₹
                        {Number(
                          planningData.priorityGoal.current_amount || 0
                        ).toLocaleString()}
                      </p>

                      <p>
                        Target: ₹
                        {Number(
                          planningData.priorityGoal.target_amount || 0
                        ).toLocaleString()}
                      </p>

                      <p className="font-semibold" style={{ color: TEAL }}>
                        Remaining: ₹
                        {Math.max(
                          0,
                          Number(
                            planningData.priorityGoal.target_amount || 0
                          ) -
                            Number(
                              planningData.priorityGoal.current_amount || 0
                            )
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>


                  {/* Tax Status */}
                  <div className="rounded-md p-5" style={{ backgroundColor: CANVAS, border: `1px solid ${LINE}` }}>

                    <div className="flex items-center gap-2 mb-3">

                      <FileText
                        style={{ color: AMBER }}
                        size={20}
                      />

                      <span className="text-sm font-semibold" style={{ color: AMBER }}>
                        Tax Readiness
                      </span>

                    </div>

                    <div className="space-y-2 text-sm" style={{ color: INK_SOFT }}>

                      <p>
                        Recorded Income:{" "}
                        <span className="font-semibold" style={{ color: INK }}>
                          ₹
                          {planningData.totalIncome.toLocaleString()}
                        </span>
                      </p>

                      <p>
                        Missing Documents:{" "}
                        <span
                          className="font-semibold"
                          style={{ color: planningData.missingDocuments > 0 ? ROSE : TEAL }}
                        >
                          {planningData.missingDocuments}
                        </span>
                      </p>

                      <p>
                        Checklist Progress:{" "}
                        <span className="font-semibold" style={{ color: AMBER }}>
                          {planningData.checklistProgress}%
                        </span>
                      </p>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="flex items-center gap-3 rounded-md p-5" style={{ backgroundColor: CANVAS, border: `1px solid ${LINE}` }}>

                  <AlertTriangle
                    style={{ color: AMBER }}
                    size={20}
                  />

                  <p className="text-sm" style={{ color: INK_SOFT }}>
                    Create a financial goal to give Finny more personalized
                    planning context.
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* ================= CHATBOT CONTAINER ================= */}

          <div className="max-w-5xl mx-auto">

            <div className="relative">

              <div className="absolute -inset-4 rounded-md blur-2xl opacity-10" style={{ backgroundColor: AMBER }}></div>

              <div className="relative rounded-md shadow-xl overflow-hidden" style={{ backgroundColor: PAPER, border: `1px solid ${LINE}` }}>

                {/* Header */}
                <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: INK }}>

                  <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: `${PAPER}26` }}>
                    <Sparkles style={{ color: PAPER }} size={20} />
                  </div>

                  <div>

                    <h3 className="font-serif font-bold text-lg" style={{ color: PAPER }}>
                      RupeeMate AI Advisor
                    </h3>

                    <p className="text-sm" style={{ color: LINE }}>
                      Ask me anything about investing & savings
                    </p>

                  </div>

                  <div className="ml-auto flex items-center gap-2">

                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: AMBER }}></div>

                    <span className="text-sm font-medium" style={{ color: PAPER }}>
                      Online
                    </span>

                  </div>

                </div>


                {/* Chatbot Iframe */}
                <div style={{ backgroundColor: CANVAS }}>

                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/WrJgnsAsSqMS7eCzk691x"
                    width="100%"
                    style={{
                      height: "700px",
                      minHeight: "700px",
                      border: "none",
                    }}
                    title="RupeeMate AI Chatbot"
                  ></iframe>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* What You Can Ask Section */}
      <section className="py-16 px-6" style={{ backgroundColor: PAPER }}>

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="font-serif text-3xl md:text-4xl mb-4" style={{ color: INK }}>
              What Can You Ask?
            </h2>

            <p className="text-lg" style={{ color: INK_SOFT }}>
              Our AI assistant is trained to help you with various financial topics
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                icon: TrendingUp,
                title: "Investment Advice",
                description:
                  "Get recommendations on stocks, mutual funds, and SIPs",
                gradient: "from-[#3F6B4D] to-[#5C7A5C]",
              },
              {
                icon: MessageSquare,
                title: "Savings Strategies",
                description:
                  "Learn how to maximize your savings and reach goals faster",
                gradient: "from-[#1B2B44] to-[#33445F]",
              },
              {
                icon: Brain,
                title: "Financial Planning",
                description:
                  "Create personalized plans for retirement, education, and more",
                gradient: "from-[#6B4E71] to-[#8A6D3B]",
              },
              {
                icon: Sparkles,
                title: "Market Insights",
                description:
                  "Understand market trends and make informed decisions",
                gradient: "from-[#B8860B] to-[#C77D22]",
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (

                <div
                  key={index}
                  className="rounded-md p-6 transition-all transform hover:-translate-y-1"
                  style={{ backgroundColor: CANVAS, border: `1px solid ${LINE}` }}
                >

                  <div
                    className={`w-14 h-14 rounded-md bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>

                  <h3 className="font-serif text-lg mb-2" style={{ color: INK }}>
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed" style={{ color: INK_SOFT }}>
                    {item.description}
                  </p>

                </div>

              );
            })}

          </div>

        </div>

      </section>


      {/* Tips Section */}
      <section className="py-16 px-6" style={{ backgroundColor: CANVAS }}>

        <div className="max-w-4xl mx-auto">

          <div className="rounded-md p-8 md:p-12 shadow-xl relative overflow-hidden" style={{ backgroundColor: INK }}>

            <div className="relative z-10">

              <h2 className="font-serif text-2xl md:text-3xl mb-6" style={{ color: PAPER }}>
                Tips for Best Results
              </h2>

              <ul className="space-y-3" style={{ color: LINE }}>

                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: AMBER }}>✓</span>
                  <span>
                    Be specific about your financial goals and current situation
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: AMBER }}>✓</span>
                  <span>
                    Ask about investment options that match your risk tolerance
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: AMBER }}>✓</span>
                  <span>
                    Inquire about tax-saving strategies and investment plans
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: AMBER }}>✓</span>
                  <span>
                    Request clarification if you don't understand any financial terms
                  </span>
                </li>

              </ul>

            </div>

          </div>

        </div>

      </section>


      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          33% {
            transform: translate(30px, -50px) scale(1.1);
          }

          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

    </div>
  );
};

export default AIChatbotPage;