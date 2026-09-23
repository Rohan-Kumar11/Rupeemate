"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useInView,
  useScroll,
  useSpring,
  useReducedMotion,
  type Variants,
  type Transition,
  type TargetAndTransition,
} from "framer-motion";
import {
  ArrowRight,
  Wallet,
  PiggyBank,
  ShieldCheck,
  Receipt,
  CalendarClock,
  Gift,
  Link2,
  Activity,
  SlidersHorizontal,
  TrendingUp,
  LineChart as LineChartIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const revealParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
};

const revealChild: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className={className}
      variants={revealParent}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.section>
  );
}

/** Spread onto a motion element: animates from -> to when scrolled into view.
 *  With reduced motion, returns nothing so the element shows its final style. */
function useInViewProps() {
  const reduce = useReducedMotion();
  return (
    from: TargetAndTransition,
    to: TargetAndTransition,
    transition?: Transition
  ) =>
    reduce
      ? {}
      : {
          initial: from,
          whileInView: to,
          viewport: { once: true, margin: "-40px" },
          transition,
        };
}

function CountUp({ to, prefix = "₹" }: { to: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduce) return setValue(to);
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const WEEK_INCOME = [
  { day: "Mon", amount: 62 },
  { day: "Tue", amount: 28 },
  { day: "Wed", amount: 91 },
  { day: "Thu", amount: 34 },
  { day: "Fri", amount: 100 },
  { day: "Sat", amount: 47 },
  { day: "Sun", amount: 20 },
];

const STEPS = [
  { icon: Link2, title: "Connect", text: "Link UPI, a bank, or add earnings by hand." },
  { icon: Activity, title: "We learn your pattern", text: "High weeks and lean weeks, mapped over time." },
  { icon: SlidersHorizontal, title: "Saving scales", text: "A share of each payout, not a fixed sum." },
  { icon: TrendingUp, title: "Invest and file", text: "Matched to your risk, kept tax-ready." },
];

/* ------------------------------------------------------------------ */
/* Hero visual                                                         */
/* ------------------------------------------------------------------ */

function IncomePulse() {
  const rv = useInViewProps();
  const max = 100;
  const steadyLine = 52;
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-6 pt-10">
      <motion.div
        className="absolute -top-4 right-6 flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-white"
        {...rv({ opacity: 0, y: 12 }, { opacity: 1, y: 0 }, { duration: 0.6, delay: 1.5, ease: EASE })}
      >
        <PiggyBank size={16} className="text-[var(--amber)]" />
        Saved this week <strong className="font-medium"><CountUp to={364} /></strong>
      </motion.div>

      <div className="relative flex h-52 items-end justify-between gap-2 border-b border-l border-[var(--line)] pb-3 pl-3">
        <motion.div
          className="absolute left-0 right-0 origin-left border-t-2 border-dashed"
          style={{ bottom: `${(steadyLine / max) * 100}%`, borderColor: "var(--amber)" }}
          {...rv({ scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1 }, { duration: 0.9, delay: 0.9, ease: EASE })}
        />
        {WEEK_INCOME.map((d, i) => {
          const pct = (d.amount / max) * 100;
          const dim = active !== null && active !== i;
          return (
            <button
              type="button"
              key={d.day}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="relative flex h-full flex-1 flex-col items-center justify-end gap-2 outline-none"
            >
              {active === i && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute left-1/2 z-10 whitespace-nowrap rounded-md bg-[var(--ink)] px-3 py-1.5 text-xs text-white"
                  style={{ x: "-50%", bottom: `calc(${pct}% + 2rem)` }}
                >
                  <p className="font-medium">₹{d.amount * 10} earned</p>
                  <p className="text-white/70">₹52 saved</p>
                </motion.div>
              )}
              <motion.div
                className="w-full rounded-t-sm transition-[opacity,background-color] duration-200"
                style={{
                  background: active === i ? "var(--amber)" : "var(--teal)",
                  opacity: dim ? 0.45 : 1,
                  maxWidth: 22,
                  height: `${pct}%`,
                }}
                {...rv({ height: 0 }, { height: `${pct}%` }, { duration: 0.6, delay: 0.08 * i, ease: EASE })}
              />
              <span className="text-[11px] text-[var(--ink-soft)]">{d.day}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-[var(--ink-soft)]">
        Bars: what you earned. Dashed line: what still gets saved.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Problem visual: fixed plan vs adaptive plan                         */
/* ------------------------------------------------------------------ */

function Bars({ heights, color, delay = 0 }: { heights: number[]; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const show = inView || reduce;
  return (
    <div ref={ref} className="flex h-20 items-end gap-2">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ background: color }}
          initial={{ height: 0 }}
          animate={{ height: show ? `${h}%` : "0%" }}
          transition={{ duration: reduce ? 0 : 0.5, delay: delay + i * 0.05, ease: EASE }}
        />
      ))}
    </div>
  );
}

function CompareVisual() {
  const [level, setLevel] = useState(100);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <p className="mb-4 text-sm font-medium text-[var(--ink-soft)]">Typical fixed plan</p>
          <Bars heights={WEEK_INCOME.map(() => 50)} color="#cfcbc2" />
          <p className="mt-4 text-sm text-[var(--ink-soft)]">Same amount, even on a ₹20 day.</p>
        </div>
        <div className="rounded-2xl border border-[var(--teal)] bg-white p-5">
          <p className="mb-4 text-sm font-medium text-[var(--teal)]">RupeeMate</p>
          <Bars
            heights={WEEK_INCOME.map((d) => Math.max(d.amount * 0.55 * (level / 100), 8))}
            color="var(--teal)"
            delay={0.3}
          />
          <p className="mt-4 text-sm text-[var(--ink-soft)]">A share of what actually came in.</p>
        </div>
      </div>
      <label className="mt-5 flex items-center gap-4 text-sm text-[var(--ink-soft)]">
        <span>Slow week</span>
        <input
          type="range"
          min={20}
          max={100}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          aria-label="Simulate a slow or strong week"
          className="h-1 flex-1 cursor-pointer accent-[var(--teal)]"
        />
        <span>Strong week</span>
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step flow: icons on a line that draws itself                        */
/* ------------------------------------------------------------------ */

function StepFlow() {
  const rv = useInViewProps();
  const [active, setActive] = useState<number | null>(null);
  return (
    <div
      className="relative grid gap-10 md:grid-cols-4 md:gap-6"
      onMouseLeave={() => setActive(null)}
    >
      <div className="absolute left-6 right-6 top-6 hidden h-px bg-[var(--line)] md:block" />
      <motion.div
        className="absolute left-6 right-6 top-6 hidden h-px origin-left bg-[var(--teal)] md:block"
        {...rv({ scaleX: 0 }, { scaleX: 1 }, { duration: 1.4, delay: 0.3, ease: "easeInOut" })}
      />
      <div
        className="absolute left-6 top-6 z-[5] hidden h-0.5 bg-[var(--amber)] transition-[width] duration-500 md:block"
        style={{ width: active === null ? 0 : `calc(${active} * (25% + 0.375rem))` }}
      />
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const lit = active !== null && i <= active;
        return (
          <motion.div
            key={s.title}
            variants={revealChild}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className="relative rounded-lg outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[var(--teal)]"
          >
            <motion.div
              className={`relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-300 ${
                lit
                  ? "border-[var(--amber)] bg-[var(--teal)] text-white"
                  : "border-[var(--teal)] bg-white text-[var(--teal)]"
              }`}
              {...rv({ scale: 0.6 }, { scale: 1 }, { type: "spring", stiffness: 260, damping: 16, delay: 0.3 + i * 0.3 })}
            >
              <Icon size={20} />
            </motion.div>
            <h3 className="mb-1 text-lg font-medium">{s.title}</h3>
            <p className="max-w-[16rem] text-sm leading-relaxed text-[var(--ink-soft)]">{s.text}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feature mini-visuals                                                */
/* ------------------------------------------------------------------ */

function InsightVisual() {
  const rv = useInViewProps();
  return (
    <svg viewBox="0 0 220 80" className="h-full w-full" fill="none">
      <motion.path
        d="M4 60 L34 34 L64 52 L94 14 L124 46 L154 26 L184 62 L214 24"
        stroke="var(--teal)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rv({ pathLength: 0 }, { pathLength: 1 }, { duration: 1.6, ease: "easeInOut" })}
      />
      <motion.circle
        cx="184" cy="62" r="5" fill="var(--amber)"
        {...rv({ scale: 0, opacity: 0 }, { scale: 1, opacity: 1 }, { delay: 1.4, duration: 0.4 })}
      />
      <text x="146" y="78" fontSize="9" fill="var(--ink-soft)">slow week</text>
    </svg>
  );
}

function SavingsVisual() {
  const rv = useInViewProps();
  const rows = [
    { label: "₹2,000 payout", width: 100, saved: "₹400" },
    { label: "₹600 payout", width: 30, saved: "₹120" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      {rows.map((r, i) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-xs text-[var(--ink-soft)]">
            <span>{r.label}</span>
            <span className="text-[var(--teal)]">{r.saved} saved</span>
          </div>
          <div className="h-3" style={{ width: `${r.width}%` }}>
            <motion.div
              className="relative h-full origin-left overflow-hidden rounded-full bg-[#dcd9d0]"
              {...rv({ scaleX: 0 }, { scaleX: 1 }, { duration: 0.8, delay: i * 0.2, ease: EASE })}
            >
              <div className="h-full w-1/5 bg-[var(--teal)]" />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RiskVisual() {
  const rv = useInViewProps();
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="relative h-2 rounded-full" style={{ background: "linear-gradient(90deg, var(--teal), var(--amber))" }}>
        <motion.div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--ink)]"
          style={{ left: "35%" }}
          {...rv({ left: "0%" }, { left: "35%" }, { duration: 1.2, delay: 0.3, ease: EASE })}
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-[var(--ink-soft)]">
        <span>Safer</span>
        <span>Growth</span>
      </div>
    </div>
  );
}

function TaxVisual() {
  const dates = ["15 Jun", "15 Sep", "15 Dec", "15 Mar"];
  return (
    <div className="grid h-full grid-cols-4 items-center gap-2">
      {dates.map((d, i) => {
        const next = i === 2;
        return (
          <motion.div
            key={d}
            variants={revealChild}
            className={`relative rounded-md border py-3 text-center text-xs ${
              next ? "border-[var(--amber)] font-medium text-[var(--ink)]" : "border-[var(--line)] text-[var(--ink-soft)]"
            }`}
          >
            {next && (
              <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--amber)] opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--amber)]" />
              </span>
            )}
            {d}
          </motion.div>
        );
      })}
    </div>
  );
}

interface Feature {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  text: string;
  path: string;
  visual: React.ReactNode;
}

const FEATURES: Feature[] = [
  { icon: LineChartIcon, title: "Income pattern analysis", text: "Tells a slow week from a real drop.", path: "/insights", visual: <InsightVisual /> },
  { icon: PiggyBank, title: "Adaptive micro-savings", text: "Every payout sets aside its own share.", path: "/goals", visual: <SavingsVisual /> },
  { icon: Wallet, title: "Risk-matched investing", text: "SIPs and funds weighted to your comfort.", path: "/ai-planner", visual: <RiskVisual /> },
  { icon: Receipt, title: "Tax companion", text: "Advance-tax dates flagged as they come.", path: "/tax-center", visual: <TaxVisual /> },
];

function FeatureCard({ f, onOpen }: { f: Feature; onOpen: () => void }) {
  const Icon = f.icon;
  const move = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.button
      variants={revealChild}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={move}
      onClick={onOpen}
      className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-6 text-left transition-colors hover:border-[var(--teal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--teal)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(15,76,70,0.10), transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="mb-6 h-28 overflow-hidden rounded-lg bg-[var(--canvas)] p-4">{f.visual}</div>
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-[var(--teal)]" />
          <h3 className="text-lg font-medium">{f.title}</h3>
          <ArrowRight
            size={16}
            className="ml-auto -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
          />
        </div>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">{f.text}</p>
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const HomePage: React.FC = () => {
  const router = useRouter();
  const go = (path: string) => router.push(path);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <div
      style={
        {
          ["--paper" as string]: "#ffffff",
          ["--canvas" as string]: "#f7f7f4",
          ["--ink" as string]: "#14171f",
          ["--ink-soft" as string]: "#5b5f68",
          ["--teal" as string]: "#0f4c46",
          ["--amber" as string]: "#c2760c",
          ["--line" as string]: "#e7e5e0",
        } as React.CSSProperties
      }
      className="bg-[var(--paper)] text-[var(--ink)]"
    >
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-[var(--amber)]"
        style={{ scaleX: progress }}
      />
      {/* Hero */}
      <section className="px-6 pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h1 className="mb-6 font-serif text-5xl leading-[1.08] md:text-6xl">
              Some weeks you earn a lot.
              <br />
              Some weeks, barely anything.
              <br />
              Your money plan should know that.
            </h1>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-[var(--ink-soft)]">
              Savings, investing, and tax habits built around how you actually get paid.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
                onClick={() => go("/hub")}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-7 py-3.5 font-medium text-white transition-colors hover:bg-[var(--teal)]"
              >
                See your income pattern
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
                onClick={() => go("/ai-planner")}
                className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] px-7 py-3.5 font-medium transition-colors hover:border-[var(--ink)]"
              >
                Talk to the AI planner
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="justify-self-center md:justify-self-end"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <IncomePulse />
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <Reveal className="bg-[var(--canvas)] px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-x-16 gap-y-10 md:grid-cols-2">
          <motion.h2 variants={revealChild} className="font-serif text-3xl leading-tight md:text-4xl">
            Most financial tools assume a salary.
            <br />
            You have earnings.
          </motion.h2>
          <motion.div variants={revealChild}>
            <CompareVisual />
          </motion.div>
        </div>
      </Reveal>

      {/* How it works */}
      <Reveal className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.h2 variants={revealChild} className="mb-14 max-w-xl font-serif text-3xl md:text-4xl">
            How it adapts to your week
          </motion.h2>
          <StepFlow />
        </div>
      </Reveal>

      {/* Features */}
      <Reveal className="bg-[var(--canvas)] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.h2 variants={revealChild} className="mb-14 max-w-xl font-serif text-3xl md:text-4xl">
            What&apos;s actually inside
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((f) => (
              <FeatureCard key={f.path} f={f} onOpen={() => go(f.path)} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Trust */}
      <Reveal className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, label: "Bank-grade encryption on every link" },
            { icon: CalendarClock, label: "No fixed monthly commitment" },
            { icon: Gift, label: "Free to start" },
          ].map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              variants={revealChild}
              className="flex items-center gap-3 rounded-xl border border-[var(--line)] px-5 py-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--canvas)] text-[var(--teal)]">
                <Icon size={18} />
              </span>
              <span className="text-sm text-[var(--ink-soft)]">{label}</span>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* Closing CTA */}
      <Reveal className="border-t border-[var(--line)] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2 variants={revealChild} className="mb-8 font-serif text-3xl md:text-4xl">
            Start where your income already is.
          </motion.h2>
          <motion.div variants={revealChild}>
            <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
              onClick={() => go("/hub")}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-8 py-4 font-medium text-white transition-colors hover:bg-[var(--teal)]"
            >
              Get started, it&apos;s free
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </Reveal>
    </div>
  );
};

export default HomePage;