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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50">

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 relative overflow-hidden">

        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>

        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="text-center space-y-6 mb-12">

            <div className="inline-flex items-center gap-2 bg-white text-purple-600 px-5 py-2.5 rounded-full shadow-md border border-purple-100 text-sm font-semibold">
              <Brain size={16} className="animate-pulse" />
              <span>AI-Powered Financial Assistant</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Your Personal{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                AI Investment Advisor
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Get instant answers to your financial questions. Our AI-powered
              chatbot provides personalized investment advice, savings
              strategies, and financial planning guidance 24/7.
            </p>

            {/* Feature Pills */}
            <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                <Zap className="text-yellow-500" size={18} />
                <span className="text-sm text-gray-700 font-medium">
                  Instant Responses
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                <Shield className="text-green-500" size={18} />
                <span className="text-sm text-gray-700 font-medium">
                  Secure & Private
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                <MessageSquare className="text-blue-500" size={18} />
                <span className="text-sm text-gray-700 font-medium">
                  24/7 Available
                </span>
              </div>

            </div>
          </div>


          {/* ================= FINANCIAL PLAN CONTEXT ================= */}

          <div className="max-w-5xl mx-auto mb-8">

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Brain className="text-white" size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Your Financial Plan
                  </h2>

                  <p className="text-sm text-gray-500">
                    Live context from your RupeeMate goals and tax records
                  </p>
                </div>

              </div>


              {planningData.priorityGoal ? (

                <div className="grid md:grid-cols-2 gap-5">

                  {/* Priority Goal */}
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5">

                    <div className="flex items-center gap-2 mb-3">
                      <Target className="text-emerald-600" size={20} />

                      <span className="text-sm font-semibold text-emerald-700">
                        Priority Goal
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">
                      {planningData.priorityGoal.name}
                    </h3>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">

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

                      <p className="font-semibold text-emerald-700">
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
                  <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-5">

                    <div className="flex items-center gap-2 mb-3">

                      <FileText
                        className="text-blue-600"
                        size={20}
                      />

                      <span className="text-sm font-semibold text-blue-700">
                        Tax Readiness
                      </span>

                    </div>

                    <div className="space-y-2 text-sm text-gray-600">

                      <p>
                        Recorded Income:{" "}
                        <span className="font-semibold text-gray-900">
                          ₹
                          {planningData.totalIncome.toLocaleString()}
                        </span>
                      </p>

                      <p>
                        Missing Documents:{" "}
                        <span
                          className={`font-semibold ${
                            planningData.missingDocuments > 0
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {planningData.missingDocuments}
                        </span>
                      </p>

                      <p>
                        Checklist Progress:{" "}
                        <span className="font-semibold text-blue-700">
                          {planningData.checklistProgress}%
                        </span>
                      </p>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-5">

                  <AlertTriangle
                    className="text-amber-500"
                    size={20}
                  />

                  <p className="text-sm text-gray-600">
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

              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-20"></div>

              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 px-6 py-4 flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="text-white" size={20} />
                  </div>

                  <div>

                    <h3 className="text-white font-bold text-lg">
                      RupeeMate AI Advisor
                    </h3>

                    <p className="text-white/80 text-sm">
                      Ask me anything about investing & savings
                    </p>

                  </div>

                  <div className="ml-auto flex items-center gap-2">

                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>

                    <span className="text-white text-sm font-medium">
                      Online
                    </span>

                  </div>

                </div>


                {/* Chatbot Iframe */}
                <div className="bg-gray-50">

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
      <section className="py-16 px-6 bg-white">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Can You Ask?
            </h2>

            <p className="text-lg text-gray-600">
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
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: MessageSquare,
                title: "Savings Strategies",
                description:
                  "Learn how to maximize your savings and reach goals faster",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Brain,
                title: "Financial Planning",
                description:
                  "Create personalized plans for retirement, education, and more",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Sparkles,
                title: "Market Insights",
                description:
                  "Understand market trends and make informed decisions",
                gradient: "from-amber-500 to-orange-500",
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (

                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all transform hover:-translate-y-2"
                >

                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>

                </div>

              );
            })}

          </div>

        </div>

      </section>


      {/* Tips Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-blue-50">

        <div className="max-w-4xl mx-auto">

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">

            <div className="absolute inset-0 bg-white opacity-5"></div>

            <div className="relative z-10">

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                💡 Tips for Best Results
              </h2>

              <ul className="space-y-3 text-white/90">

                <li className="flex items-start gap-3">
                  <span className="text-xl">✓</span>
                  <span>
                    Be specific about your financial goals and current situation
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-xl">✓</span>
                  <span>
                    Ask about investment options that match your risk tolerance
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-xl">✓</span>
                  <span>
                    Inquire about tax-saving strategies and investment plans
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-xl">✓</span>
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

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>

    </div>
  );
};

export default AIChatbotPage;