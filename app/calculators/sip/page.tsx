"use client";

import React, { useState, useEffect } from "react";

import {
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  PiggyBank,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  TooltipProps,
} from "recharts";

import GoalInvestmentContext from "@/components/GoalInvestmentContext";

interface SIPResults {
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
}

interface ChartDataPoint {
  year: number;
  invested: number;
  value: number;
}

type ActiveCard = "invested" | "returns" | "total" | null;

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

export default function SIPCalculator(): React.JSX.Element {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  const [results, setResults] = useState<SIPResults>({
    totalInvestment: 0,
    estimatedReturns: 0,
    totalValue: 0,
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeCard, setActiveCard] = useState<ActiveCard>(null);

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const calculateSIP = (): void => {
    const P: number = monthlyInvestment;
    const r: number = expectedReturn / 12 / 100;
    const n: number = timePeriod * 12;

    if (r === 0) {
      const totalInvestment: number = P * n;

      setResults({
        totalInvestment,
        estimatedReturns: 0,
        totalValue: totalInvestment,
      });

      generateChartData(0);
      return;
    }

    const M: number =
      P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));

    const totalInvestment: number = P * n;
    const estimatedReturns: number = M - totalInvestment;

    setResults({
      totalInvestment,
      estimatedReturns,
      totalValue: M,
    });

    generateChartData(r);
  };

  const generateChartData = (monthlyRate: number): void => {
    const data: ChartDataPoint[] = [];
    const P: number = monthlyInvestment;
    const years: number = Math.min(timePeriod, 20);

    for (let year = 0; year <= years; year++) {
      const months: number = year * 12;
      const invested: number = P * months;

      let value: number = invested;

      if (monthlyRate > 0 && months > 0) {
        value =
          P *
          (((Math.pow(1 + monthlyRate, months) - 1) /
            monthlyRate) *
            (1 + monthlyRate));
      }

      data.push({
        year,
        invested,
        value: Math.round(value),
      });
    }

    setChartData(data);
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({
    active,
    payload,
  }: CustomTooltipProps): React.JSX.Element | null => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700">
          <p className="font-semibold mb-1">
            Year {payload[0].payload.year}
          </p>

          <p className="text-blue-400 text-sm">
            Invested:{" "}
            {formatCurrency(payload[0].payload.invested)}
          </p>

          <p className="text-green-400 text-sm">
            Value: {formatCurrency(payload[0].payload.value)}
          </p>
        </div>
      );
    }

    return null;
  };

  const getSliderBackground = (
    value: number,
    min: number,
    max: number,
    color1: string,
    color2: string,
    bgColor: string
  ): string => {
    const percentage = ((value - min) / (max - min)) * 100;

    return `linear-gradient(to right, ${color1} 0%, ${color2} ${percentage}%, ${bgColor} ${percentage}%, ${bgColor} 100%)`;
  };

  const handleMonthlyInvestmentChange = (value: string): void => {
    setMonthlyInvestment(Number(value));
  };

  const handleExpectedReturnChange = (value: string): void => {
    setExpectedReturn(Number(value));
  };

  const handleTimePeriodChange = (value: string): void => {
    setTimePeriod(Number(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-8 mt-16">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* GOAL INTEGRATION */}
        <div className="mb-8">
          <GoalInvestmentContext />
        </div>

        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Sparkles size={16} />
            Smart Investment Calculator
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            SIP Calculator
          </h1>

          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Discover the power of systematic investing and watch your wealth grow
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

          <div className="lg:col-span-1 space-y-6">

            <div className="bg-white backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <DollarSign size={24} className="text-white" />
                </div>

                <div>
                  <label className="text-gray-900 font-bold text-lg">
                    Monthly Investment
                  </label>

                  <p className="text-gray-600 text-xs">
                    How much you'll invest each month
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlyInvestment}
                  onChange={(e) =>
                    handleMonthlyInvestmentChange(e.target.value)
                  }
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: getSliderBackground(
                      monthlyInvestment,
                      500,
                      100000,
                      "#3b82f6",
                      "#8b5cf6",
                      "#e5e7eb"
                    ),
                  }}
                />

                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) =>
                    handleMonthlyInvestmentChange(e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

              </div>
            </div>

            <div className="bg-white backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">

              <div className="flex items-center gap-3 mb-4">

                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Percent size={24} className="text-white" />
                </div>

                <div>
                  <label className="text-gray-900 font-bold text-lg">
                    Expected Return
                  </label>

                  <p className="text-gray-600 text-xs">
                    Annual growth rate (% p.a.)
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={expectedReturn}
                  onChange={(e) =>
                    handleExpectedReturnChange(e.target.value)
                  }
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: getSliderBackground(
                      expectedReturn,
                      1,
                      30,
                      "#10b981",
                      "#34d399",
                      "#e5e7eb"
                    ),
                  }}
                />

                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) =>
                    handleExpectedReturnChange(e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xl font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  step="0.5"
                />

              </div>
            </div>

            <div className="bg-white backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">

              <div className="flex items-center gap-3 mb-4">

                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Calendar size={24} className="text-white" />
                </div>

                <div>
                  <label className="text-gray-900 font-bold text-lg">
                    Time Period
                  </label>

                  <p className="text-gray-600 text-xs">
                    Investment duration in years
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={timePeriod}
                  onChange={(e) =>
                    handleTimePeriodChange(e.target.value)
                  }
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: getSliderBackground(
                      timePeriod,
                      1,
                      40,
                      "#8b5cf6",
                      "#a78bfa",
                      "#e5e7eb"
                    ),
                  }}
                />

                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) =>
                    handleTimePeriodChange(e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xl font-bold focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />

              </div>
            </div>

          </div>

          <div className="lg:col-span-2 space-y-6">

            <div className="grid sm:grid-cols-3 gap-4">

              <div
                className={`bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30 shadow-2xl transform transition-all duration-300 cursor-pointer ${
                  activeCard === "invested"
                    ? "scale-105 ring-4 ring-blue-400"
                    : "hover:scale-105"
                }`}
                onMouseEnter={() => setActiveCard("invested")}
                onMouseLeave={() => setActiveCard(null)}
              >

                <div className="flex items-center gap-2 mb-3">
                  <PiggyBank size={20} className="text-blue-600" />
                  <p className="text-blue-700 text-sm font-semibold">
                    Invested Amount
                  </p>
                </div>

                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {formatCurrency(results.totalInvestment)}
                </p>

                <div className="h-1 bg-blue-500 rounded-full mt-2"></div>
              </div>

              <div
                className={`bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30 shadow-2xl transform transition-all duration-300 cursor-pointer ${
                  activeCard === "returns"
                    ? "scale-105 ring-4 ring-green-400"
                    : "hover:scale-105"
                }`}
                onMouseEnter={() => setActiveCard("returns")}
                onMouseLeave={() => setActiveCard(null)}
              >

                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={20} className="text-green-600" />
                  <p className="text-green-700 text-sm font-semibold">
                    Est. Returns
                  </p>
                </div>

                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {formatCurrency(results.estimatedReturns)}
                </p>

                <div className="h-1 bg-green-500 rounded-full mt-2"></div>
              </div>

              <div
                className={`bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30 shadow-2xl transform transition-all duration-300 cursor-pointer ${
                  activeCard === "total"
                    ? "scale-105 ring-4 ring-purple-400"
                    : "hover:scale-105"
                }`}
                onMouseEnter={() => setActiveCard("total")}
                onMouseLeave={() => setActiveCard(null)}
              >

                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={20} className="text-purple-600" />
                  <p className="text-purple-700 text-sm font-semibold">
                    Total Value
                  </p>
                </div>

                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {formatCurrency(results.totalValue)}
                </p>

                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
              </div>

            </div>

            <div className="bg-white backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-xl">

              <h3 className="text-gray-900 font-bold text-xl mb-6 flex items-center gap-2">
                <TrendingUp className="text-purple-600" />
                Investment Growth Over Time
              </h3>

              <ResponsiveContainer width="100%" height={300}>

                <AreaChart data={chartData}>

                  <defs>

                    <linearGradient
                      id="colorInvested"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="colorValue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.4}
                      />

                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0}
                      />
                    </linearGradient>

                  </defs>

                  <XAxis
                    dataKey="year"
                    stroke="#94a3b8"
                    tick={{ fill: "#64748b" }}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: "#64748b" }}
                    tickFormatter={(value: number) =>
                      formatCurrency(value)
                    }
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="invested"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#colorInvested)"
                  />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#colorValue)"
                  />

                </AreaChart>

              </ResponsiveContainer>

              <div className="flex justify-center gap-6 mt-4">

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-700 text-sm">
                    Invested
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-700 text-sm">
                    Total Value
                  </span>
                </div>

              </div>

            </div>

            <div className="bg-white backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-xl">

              <h3 className="text-gray-900 font-bold text-lg mb-4">
                Wealth Breakdown
              </h3>

              <div className="relative h-16 flex rounded-2xl overflow-hidden shadow-lg">

                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold transition-all duration-500 hover:brightness-110"
                  style={{
                    width: `${
                      results.totalValue > 0
                        ? (results.totalInvestment /
                            results.totalValue) *
                          100
                        : 0
                    }%`,
                  }}
                >
                  {results.totalValue > 0
                    ? (
                        (results.totalInvestment /
                          results.totalValue) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>

                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold transition-all duration-500 hover:brightness-110"
                  style={{
                    width: `${
                      results.totalValue > 0
                        ? (results.estimatedReturns /
                            results.totalValue) *
                          100
                        : 0
                    }%`,
                  }}
                >
                  {results.totalValue > 0
                    ? (
                        (results.estimatedReturns /
                          results.totalValue) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>

              </div>

              <div className="flex justify-between mt-4">

                <span className="flex items-center gap-2 text-gray-700">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Your Investment
                </span>

                <span className="flex items-center gap-2 text-gray-700">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Wealth Created
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-8 bg-white backdrop-blur-xl rounded-2xl p-8 border border-gray-200 shadow-xl">

          <div className="flex items-start gap-4">

            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <ArrowRight size={24} className="text-white" />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Why SIP?
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                Systematic Investment Plans help you build wealth gradually
                through disciplined investing. By investing fixed amounts
                regularly, you benefit from rupee cost averaging and harness
                the power of compounding - making your money work harder for
                you over time.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mt-6">

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-purple-700 font-semibold mb-1">
                    Disciplined
                  </p>

                  <p className="text-gray-600 text-sm">
                    Regular investing habit
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-purple-700 font-semibold mb-1">
                    Flexible
                  </p>

                  <p className="text-gray-600 text-sm">
                    Start with small amounts
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-purple-700 font-semibold mb-1">
                    Powerful
                  </p>

                  <p className="text-gray-600 text-sm">
                    Compounding benefits
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}