"use client";

import React, { useRef, useCallback } from "react";
import { ArrowRight, LineChart, Calculator, Sparkles, Check, TrendingUp, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeatureCard {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  path: string;
  gradient: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: LineChart,
    title: "Smart Tracking",
    description:
      "Effortlessly monitor your savings with real-time tracking. Visualize your progress with beautiful charts and insights.",
    path: "/insights",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calculator,
    title: "Precise Calculations",
    description:
      "Advanced calculators for compound interest, savings goals, and investment returns with confidence.",
    path: "/calculators/sip",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "AI Investment Advisor",
    description:
      "Get personalized investment suggestions powered by AI tailored to your risk profile and goals.",
    path: "/ai-planner",
    gradient: "from-amber-500 to-orange-500",
  },
];

const STEPS: Step[] = [
  {
    number: "1",
    title: "Connect Your Accounts",
    description:
      "Securely link your bank accounts and start tracking your savings automatically.",
  },
  {
    number: "2",
    title: "Set Your Goals",
    description:
      "Define your financial targets and let our calculators show you the path forward.",
  },
  {
    number: "3",
    title: "Get AI Recommendations",
    description:
      "Receive personalized investment suggestions and watch your wealth grow.",
  },
];

const HomePage: React.FC = () => {
  const router = useRouter();
  const stepsRef = useRef<HTMLElement>(null);

  const handleNavigation = useCallback((path: string) => {
    console.log(`Navigating to ${path}`);
    router.push(path);
  }, [router]);

  const scrollToSteps = useCallback(() => {
    stepsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-full shadow-md border border-blue-100 text-sm font-semibold hover:shadow-lg transition-shadow">
                <Sparkles size={16} className="animate-pulse" />
                <span>AI-Powered Financial Growth</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                Track, Calculate, <br />
                and{" "}
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Grow Your
                </span>{" "}
                Wealth
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Your intelligent companion for savings tracking and investment
                planning. Get personalized recommendations to maximize your
                financial potential.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
                  onClick={() => handleNavigation("/insights")}
                >
                  Start Saving Today <ArrowRight size={20} />
                </button>
                <button
                  className="px-8 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-blue-300 hover:shadow-md transition-all hover:-translate-y-1"
                  onClick={scrollToSteps}
                >
                  See How It Works
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Shield className="text-green-500" size={20} />
                  <span className="text-sm text-gray-700 font-medium">
                    Bank-level security
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Check className="text-green-500" size={20} />
                  <span className="text-sm text-gray-700 font-medium">Free to start</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-8">
                  <div className="text-center space-y-6">
                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                      <TrendingUp className="text-white" size={56} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800">
                      Financial Dashboard
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Track your wealth growth in real-time
                    </p>
                    <div className="flex items-center justify-center gap-6 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">₹1.2M</div>
                        <div className="text-xs text-gray-500">Total Saved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+24%</div>
                        <div className="text-xs text-gray-500">Growth</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap size={16} />
              <span>FEATURES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Master Your Money
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to help you save smarter and invest wisely
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.path}
                  onClick={() => handleNavigation(feature.path)}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-2xl transition-all transform hover:-translate-y-3 text-left relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
                    >
                      <Icon size={28} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight size={16} className="ml-2" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section ref={stepsRef} className="py-20 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
              <Check size={16} />
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Simple, Smart, Secure
            </h2>
            <p className="text-xl text-gray-600">
              Three steps to financial freedom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative group">
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-transparent rounded-full"></div>
                )}
                <div className="text-center space-y-4 relative">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-5"></div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Ready to Transform Your Financial Future?
                </h2>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                  Join thousands of users who are already growing their wealth with RupeeMate
                </p>
                <button
                  className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-1"
                  onClick={() => handleNavigation("/insights")}
                >
                  Get Started Now - It's Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;