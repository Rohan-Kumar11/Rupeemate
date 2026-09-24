"use client";
import React, { useState, useEffect } from 'react';
import {
  Search, Filter, TrendingUp, FileText, Wallet, PiggyBank, Clock, ChevronRight, BookOpen,
  Target, Award, BarChart, ArrowLeft, Play, CheckCircle, Circle, Download, Share2, Youtube,
  PenSquare, ExternalLink, XCircle, Send, ShieldCheck, AlertTriangle, ScrollText
} from 'lucide-react';

// ─────────────────────────── Types ───────────────────────────
interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  progress: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;   // placeholder – replace with real data
  students: string; // placeholder – replace with real data
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonContent {
  id: number;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  title: string;
  duration: string;
  // video
  youtubeId?: string;
  searchQuery?: string;
  // text
  content?: string;
  takeaway?: string;
  pointsHeading?: string;
  points?: { label: string; text: string }[];
  disclaimer?: string;
  // quiz
  questions?: QuizQuestion[];
  // assignment
  instructions?: string;
  prompt?: string;
  placeholder?: string;
  minWords?: number;
}

type Section = Omit<LessonContent, 'id'>;
const build = (sections: Section[]): LessonContent[] => sections.map((s, i) => ({ ...s, id: i + 1 }));

// ─────────────────────────── Lesson content ───────────────────────────
// Videos: replace/add YouTube IDs (the part after "v=" in a YouTube URL).
// Sections without a youtubeId show a "Search YouTube" card instead.
const LESSON_CONTENT: Record<number, LessonContent[]> = {
  // 1 ── Income pattern analysis
  1: build([
    {
      type: 'video', title: 'Why Gig Income Feels Unpredictable', duration: '8 min',
      content: 'How to budget when every week pays differently.',
      youtubeId: 'd5EZJBhyWmw', searchQuery: 'budget irregular income gig workers'
    },
    {
      type: 'text', title: 'Find Your Baseline Income', duration: '7 min',
      content: 'Traditional budgets assume a fixed salary. Gig income does not work that way, so we plan around a baseline: the amount you can count on even in a slow month.',
      takeaway: 'Plan around your worst recent month, not your best. Anything above the baseline is a bonus to save or invest.',
      pointsHeading: 'What income analysis looks at:',
      points: [
        { label: 'Baseline', text: 'Your lowest-earning month in the last 6–12 months. Fixed costs (rent, EMI, phone, food) should fit inside it.' },
        { label: 'Weekly rhythm', text: 'Which days and time slots pay best, and which are consistently slow.' },
        { label: 'Seasonality', text: 'Festival surges, monsoon dips, exam or holiday seasons that change demand.' },
        { label: 'Platform mix', text: 'How much comes from each app, and how risky it is to depend on one of them.' }
      ]
    },
    {
      type: 'quiz', title: 'Knowledge Check', duration: '4 min',
      questions: [
        {
          id: 1, question: 'When your income changes every month, what should your budget be based on?',
          options: ['Your best month', 'Your lowest recent month (baseline)', 'What you hope to earn next month', 'Your average including festival months'],
          correctAnswer: 1,
          explanation: 'Budgeting from a conservative baseline keeps essentials covered in slow months. Good months then become extra savings instead of a gap you have to fill.'
        },
        {
          id: 2, question: 'Why is tracking earnings by platform useful?',
          options: ['It reduces your tax to zero', 'It shows how dependent you are on any single source', 'It increases your ratings', 'It is required to open a bank account'],
          correctAnswer: 1,
          explanation: 'If one app drives most of your income, a policy change or ID block can hit you hard. Seeing the split helps you plan a buffer or diversify.'
        }
      ]
    },
    {
      type: 'assignment', title: 'Assignment: Map Your Income', duration: '15 min',
      instructions: 'List your total earnings for each of the last 3–6 months (rough numbers are fine). Then work out your baseline and describe what you notice.',
      prompt: 'What is your baseline month? Which days or seasons pay best and worst? How much of your income comes from your biggest platform?',
      placeholder: 'Write your income analysis here...', minWords: 80
    }
  ]),

  // 2 ── Automatic micro-savings
  2: build([
    {
      type: 'video', title: 'Budgeting Steps for Irregular Earners', duration: '10 min',
      content: 'A step-by-step approach to setting money aside when pay varies.',
      youtubeId: 'WQbcX0MclCg', searchQuery: 'micro savings for gig workers India'
    },
    {
      type: 'text', title: 'Save a Slice of Every Payout', duration: '7 min',
      content: 'You do not need a big monthly transfer. Saving a small share of every payout, automatically, works better when income is unpredictable because the saving rises and falls with your earnings.',
      takeaway: 'Automation beats willpower. If saving needs a decision every day, it stops on the first hard week.',
      pointsHeading: 'Micro-saving methods:',
      points: [
        { label: 'Percentage rule', text: 'Move a fixed share (for example 5–15%) of every payout into a savings pot.' },
        { label: 'Round-ups', text: 'Round each transaction up to the next ₹10 and save the difference.' },
        { label: 'Pay yourself a salary', text: 'Keep earnings in a holding account and transfer yourself a fixed amount on a set date.' },
        { label: 'Sinking funds', text: 'Small pots for lumpy costs like bike servicing, phone EMI or insurance premiums.' }
      ]
    },
    {
      type: 'quiz', title: 'Knowledge Check', duration: '4 min',
      questions: [
        {
          id: 1, question: 'Why is a percentage-of-payout rule a good fit for gig workers?',
          options: ['It guarantees a fixed monthly amount', 'Savings scale with what you earn, so slow weeks do not create a shortfall', 'It avoids all bank charges', 'It replaces an emergency fund'],
          correctAnswer: 1,
          explanation: 'A percentage rule adapts to your income: you save more in busy weeks and less in slow ones, so you rarely miss a target.'
        },
        {
          id: 2, question: 'What is "paying yourself a salary"?',
          options: ['Asking your platform for a fixed wage', 'Transferring a fixed amount from a holding account on a set schedule', 'Spending only on weekends', 'Taking a loan every month'],
          correctAnswer: 1,
          explanation: 'Earnings land in a holding account and you draw a steady amount from it. Surplus from good weeks covers the slow ones.'
        }
      ]
    },
    {
      type: 'assignment', title: 'Assignment: Design Your Savings Rule', duration: '10 min',
      instructions: 'Choose a simple micro-saving rule you could follow for the next 30 days.',
      prompt: 'Which method will you use (percentage, round-up or fixed salary)? What percentage or amount, and where will the money sit? What will you do on unusually high-earning days?',
      placeholder: 'Describe your savings rule...', minWords: 60
    }
  ]),

  // 3 ── Emergency fund
  3: build([
    {
      type: 'video', title: 'Building an Emergency Fund (Hindi)', duration: '12 min',
      content: 'What an emergency fund is, how big it should be and where to keep it.',
      youtubeId: 'g-hir-4WzfU', searchQuery: 'emergency fund kitna hona chahiye'
    },
    {
      type: 'video', title: 'How Much Emergency Cash You Need in India', duration: '9 min',
      content: 'Sizing your safety net using Indian expense examples.',
      youtubeId: 'c8IRM6K9IeY', searchQuery: 'how much emergency fund India'
    },
    {
      type: 'text', title: 'Size It for Irregular Income', duration: '6 min',
      content: 'Salaried people are often advised to keep 3–6 months of expenses. With unpredictable earnings, many guides suggest a larger cushion of 6–12 months of essential costs.',
      takeaway: 'Emergency money is for safety, not returns. Keep it easy to withdraw and hard to lose.',
      pointsHeading: 'Where to keep it:',
      points: [
        { label: 'Savings account', text: 'Instantly accessible, lowest returns.' },
        { label: 'Sweep-in FD', text: 'Earns FD-like interest but can be accessed when needed.' },
        { label: 'Liquid funds', text: 'Slightly higher potential returns, usually withdrawable within a day. Not risk-free.' },
        { label: 'Milestones', text: 'Start with one month of essentials, then grow to three, six and beyond.' }
      ]
    },
    {
      type: 'quiz', title: 'Knowledge Check', duration: '4 min',
      questions: [
        {
          id: 1, question: 'Which is the most important quality of an emergency fund?',
          options: ['Highest possible return', 'Easy access and low risk', 'Locked in for 5 years', 'Invested in individual stocks'],
          correctAnswer: 1,
          explanation: 'You may need the money at short notice, so accessibility and safety matter more than returns.'
        },
        {
          id: 2, question: 'Roughly how large should the emergency fund be for someone with highly variable income?',
          options: ['1 week of expenses', '1 month of expenses', '6–12 months of essential expenses', 'Exactly one year of income'],
          correctAnswer: 2,
          explanation: 'Because income can dry up for long stretches, a larger buffer of essential expenses (rent, food, EMIs, medical) is commonly recommended.'
        }
      ]
    },
    {
      type: 'assignment', title: 'Assignment: Your Safety Net Target', duration: '10 min',
      instructions: 'Work out how big your emergency fund should be and how you will reach it.',
      prompt: 'What are your monthly essential expenses? What is your 6-month target? Where will you keep it and how much can you add each week?',
      placeholder: 'Write your safety-net plan...', minWords: 60
    }
  ]),

  // 4 ── Investing with irregular income
  4: build([
    {
      type: 'video', title: 'SIP for Beginners (Hindi)', duration: '15 min',
      content: 'What a SIP is and how to start investing small amounts regularly.',
      youtubeId: 'fLqdzG7vtps', searchQuery: 'SIP for beginners Hindi'
    },
    {
      type: 'video', title: 'How to Start a SIP (English)', duration: '15 min',
      content: 'A beginner-friendly walkthrough of Systematic Investment Plans.',
      youtubeId: 'ZXLATRO3Ifw', searchQuery: 'how to start SIP mutual funds beginners'
    },
    {
      type: 'text', title: 'Invest in the Right Order', duration: '8 min',
      content: 'Investing works best after the basics are covered. For gig workers, the order matters even more, because you may need to dip into savings during a slow month.',
      takeaway: 'Baseline budget → emergency fund → insurance → investments. Never invest money you may need in the next few months.',
      pointsHeading: 'Options suited to small, flexible contributions:',
      points: [
        { label: 'SIP', text: 'Invest a small amount regularly in a mutual fund. Many funds allow SIPs from a few hundred rupees, and some let you pause or skip.' },
        { label: 'Liquid / debt funds', text: 'Lower volatility, suitable for short-term goals.' },
        { label: 'Index or diversified equity funds', text: 'Higher long-term growth potential with more ups and downs. Best for goals 5+ years away.' },
        { label: 'Gold', text: 'Sometimes used as a small diversifier alongside other assets.' }
      ],
      disclaimer: 'Educational content only, not investment advice. Mutual fund investments are subject to market risks.'
    },
    {
      type: 'quiz', title: 'Knowledge Check', duration: '4 min',
      questions: [
        {
          id: 1, question: 'What is a SIP?',
          options: ['A one-time large investment', 'A fixed deposit with a bank', 'Investing a set amount at regular intervals in a mutual fund', 'A type of loan'],
          correctAnswer: 2,
          explanation: 'A Systematic Investment Plan invests a chosen amount at regular intervals, which builds the habit and spreads your purchases over time.'
        },
        {
          id: 2, question: 'Which money should NOT be put into equity investments?',
          options: ['Money for goals 10 years away', 'Your emergency fund', 'Surplus from very good months', 'Retirement savings'],
          correctAnswer: 1,
          explanation: 'Equity can fall in value just when you need cash. Emergency money should stay in safe, liquid options.'
        }
      ]
    },
    {
      type: 'assignment', title: 'Assignment: Your First Investment Plan', duration: '15 min',
      instructions: 'Imagine your first ₹500 a month for investing. Explain how you would start.',
      prompt: 'Which goals come first (safety net, insurance, investing)? What would you invest in and why? What would you do in a month when you cannot afford the SIP?',
      placeholder: 'Write your plan here...', minWords: 100
    }
  ]),

  // 5 ── Risk profile
  5: build([
    {
      type: 'video', title: 'Know Your Risk Profile', duration: '12 min',
      content: 'Why fund selection should begin with your risk profile, not recent returns.',
      youtubeId: 'r6A_t5hsVuM', searchQuery: 'know your risk profile mutual funds'
    },
    {
      type: 'video', title: 'Diversify Your Portfolio', duration: '8 min',
      content: 'A beginner-friendly look at spreading money across asset types.',
      youtubeId: 'A78AsHaen2Q', searchQuery: 'diversify portfolio beginners India'
    },
    {
      type: 'text', title: 'Risk Willingness vs. Risk Capacity', duration: '7 min',
      content: 'Risk profiles are usually described as conservative, moderate or aggressive. For gig workers there are two questions: how much risk are you comfortable with, and how much can you afford given unstable income?',
      takeaway: 'Even if you are comfortable with risk, irregular income lowers how much risk you can afford. A good recommendation considers both.',
      pointsHeading: 'What shapes a recommendation:',
      points: [
        { label: 'Income stability', text: 'The more your earnings swing, the more you need safe, liquid assets.' },
        { label: 'Time horizon', text: 'Money needed in under 3 years should not sit in volatile assets.' },
        { label: 'Behaviour', text: 'Do you stop saving in slow months? Do you panic when values fall? Behaviour matters as much as your answers.' },
        { label: 'Dependents and debt', text: 'More obligations mean less room for risk.' }
      ],
      disclaimer: 'Educational content only, not investment advice.'
    },
    {
      type: 'quiz', title: 'Knowledge Check', duration: '4 min',
      questions: [
        {
          id: 1, question: 'Why might a gig worker have lower risk capacity than a salaried person with the same risk appetite?',
          options: ['Gig workers cannot invest', 'Unstable income means they may need cash at short notice', 'Gig workers pay no tax', 'Mutual funds are only for salaried people'],
          correctAnswer: 1,
          explanation: 'Willingness to take risk is a feeling; capacity is financial reality. Variable income means forced withdrawals are more likely.'
        },
        {
          id: 2, question: 'What is the main aim of diversification?',
          options: ['Guaranteeing profits', 'Reducing the impact of any single investment doing badly', 'Avoiding all taxes', 'Making investing faster'],
          correctAnswer: 1,
          explanation: 'Spreading money across different assets means one poor performer hurts less. It reduces risk but cannot remove it.'
        }
      ]
    },
    {
      type: 'assignment', title: 'Assignment: Describe Your Risk Profile', duration: '10 min',
      instructions: 'Reflect on your own situation and describe your risk profile in your own words.',
      prompt: 'How would you react if an investment fell 15% in a month? How stable is your income? What is your time horizon for each goal?',
      placeholder: 'Describe your risk profile...', minWords: 80
    }
  ]),

  // 6 ── Taxes for gig workers
  6: build([
    {
      type: 'video', title: 'Tax on Freelance Income: ITR-3 vs ITR-4', duration: '12 min',
      content: 'How freelance and gig income is taxed and which return form applies.',
      youtubeId: 'iJCJnDbpRjE', searchQuery: 'tax on freelance income India ITR-3 vs ITR-4'
    },
    {
      type: 'text', title: 'How Gig Income Is Taxed in India', duration: '8 min',
      content: 'Gig and freelance earnings are generally treated as business or professional income, not salary. There is no employer to deduct tax or issue a Form 16, so you handle it yourself.',
      takeaway: 'Filing a return is about more than tax: it builds a record of income that helps with loans, visas and credit.',
      pointsHeading: 'Key ideas:',
      points: [
        { label: 'No Form 16', text: 'Platforms or clients may deduct TDS, but you still need to file and reconcile.' },
        { label: 'Presumptive taxation', text: 'Simplified schemes (Sec. 44ADA for specified professions, 44AD for small businesses) let you declare a fixed share of receipts as profit, with less bookkeeping.' },
        { label: 'ITR-3 vs ITR-4', text: 'ITR-4 is the simpler form for presumptive taxation; ITR-3 is for actual profit with books.' },
        { label: 'Records', text: 'Keep payout statements, invoices and a separate bank account or wallet for work income.' }
      ],
      disclaimer: 'Rules change (the Income-tax Act, 2025 took effect from 1 April 2026) and depend on your work. Confirm the current rules on incometax.gov.in or with a Chartered Accountant.'
    },
    {
      type: 'quiz', title: 'Knowledge Check', duration: '4 min',
      questions: [
        {
          id: 1, question: 'How is gig or freelance income generally taxed in India?',
          options: ['As salary with a Form 16', 'As business or professional income', 'It is tax-free', 'Only if you earn over ₹1 crore'],
          correctAnswer: 1,
          explanation: 'Independent earnings are usually business or professional income, so there is no employer-issued Form 16 and you must compute and file yourself.'
        },
        {
          id: 2, question: 'What does presumptive taxation mainly offer?',
          options: ['A guaranteed refund', 'A simplified way to declare profit with less bookkeeping', 'Exemption from filing a return', 'Lower TDS on all payments'],
          correctAnswer: 1,
          explanation: 'It lets eligible taxpayers declare profit as a set percentage of receipts. Eligibility conditions apply, so check before choosing it.'
        }
      ]
    },
    {
      type: 'assignment', title: 'Assignment: Your Tax Readiness Checklist', duration: '10 min',
      instructions: 'List what you already have and what is missing for filing taxes on your gig income.',
      prompt: 'Do you have a PAN and a bank account for work income? Where are your payout statements? What is one thing you will set up this month?',
      placeholder: 'Write your checklist...', minWords: 60
    }
  ]),

  // 7 ── Advance tax & filing
  7: build([
    {
      type: 'video', title: 'Advance Tax for Freelancers', duration: '10 min',
      content: 'Paying tax during the year instead of in one big bill.',
      searchQuery: 'advance tax for freelancers India explained'
    },
    {
      type: 'text', title: 'Advance Tax Without the Panic', duration: '7 min',
      content: 'If your tax after TDS is expected to exceed ₹10,000 in a year, you generally need to pay advance tax instead of waiting until you file. With uneven income, the trick is to set money aside as you earn.',
      takeaway: 'Treat a share of every payout as tax money from day one. Micro-savings can do this automatically.',
      pointsHeading: 'What to know:',
      points: [
        { label: 'Instalments', text: 'Advance tax is normally due in four instalments: 15 June, 15 September, 15 December and 15 March (15%, 45%, 75% and 100% cumulative).' },
        { label: 'Presumptive filers', text: 'Those under a presumptive scheme can generally pay in a single instalment by 15 March.' },
        { label: 'Reconcile', text: 'Match your income records with Form 26AS and AIS on the income tax portal before filing.' },
        { label: 'Deadlines', text: 'Due dates vary by case. Always check the current date on incometax.gov.in.' }
      ],
      disclaimer: 'General information only. Confirm dates and thresholds on the official portal or with a tax professional.'
    },
    {
      type: 'quiz', title: 'Knowledge Check', duration: '4 min',
      questions: [
        {
          id: 1, question: 'What is a sensible way to prepare for tax with irregular income?',
          options: ['Save nothing until March', 'Set aside a share of every payout for tax', 'Use your emergency fund', 'Stop working near year-end'],
          correctAnswer: 1,
          explanation: 'Reserving a percentage of each payout keeps tax money ready however uneven your earnings are.'
        },
        {
          id: 2, question: 'Which document helps you check TDS and income reported against your PAN?',
          options: ['Your bike RC', 'Form 26AS / AIS', 'A rental agreement', 'A bank cheque book'],
          correctAnswer: 1,
          explanation: 'Form 26AS and the Annual Information Statement (AIS) show tax deducted and income reported. Reconcile them with your records before filing.'
        }
      ]
    },
    {
      type: 'assignment', title: 'Assignment: Plan Your Tax Reserve', duration: '10 min',
      instructions: 'Decide how you will build a tax reserve from your payouts.',
      prompt: 'What share of each payout will you set aside for tax? Where will it be kept? When will you review whether advance tax applies to you?',
      placeholder: 'Write your tax reserve plan...', minWords: 60
    }
  ]),

  // 8 ── Insurance
  8: build([
    {
      type: 'video', title: 'Health and Accident Cover for Gig Workers', duration: '10 min',
      content: 'Protecting your income and savings from medical costs and accidents.',
      searchQuery: 'health insurance for gig workers India delivery partners'
    },
    {
      type: 'text', title: 'Protect the Plan', duration: '6 min',
      content: 'One hospital bill can wipe out months of savings. For gig workers, who may have no employer cover, basic insurance is part of the safety net.',
      takeaway: 'Insurance protects your savings and investments from a single bad event.',
      pointsHeading: 'What to look at:',
      points: [
        { label: 'Health cover', text: 'Check whether your platform provides any cover and what it excludes. Consider an individual policy if not.' },
        { label: 'Accident and life cover', text: 'Consider personal accident cover and term insurance if others depend on your income.' },
        { label: 'Premiums', text: 'Choose monthly or annual payment schedules you can sustain, and use a sinking fund for annual premiums.' },
        { label: 'Government schemes', text: 'Check eligibility for schemes for gig and platform workers, including e-Shram registration.' }
      ],
      disclaimer: 'Educational content only. Compare policies carefully and read exclusions before buying.'
    },
    {
      type: 'quiz', title: 'Knowledge Check', duration: '4 min',
      questions: [
        {
          id: 1, question: 'Why is health insurance part of a gig worker\'s financial plan?',
          options: ['It increases platform ratings', 'It protects savings from large medical bills', 'It replaces an emergency fund', 'It is required to file taxes'],
          correctAnswer: 1,
          explanation: 'A single medical event can drain your savings. Insurance transfers that risk so your savings and investments can stay in place.'
        },
        {
          id: 2, question: 'What should you check about platform-provided cover?',
          options: ['Only the logo', 'What it covers, its limits and exclusions', 'Nothing, it is always complete', 'Only the cost'],
          correctAnswer: 1,
          explanation: 'Platform cover can have limits, waiting periods or exclusions. Know what it does not cover so you can fill the gaps.'
        }
      ]
    },
    {
      type: 'assignment', title: 'Assignment: Protection Gap Check', duration: '10 min',
      instructions: 'Review what protection you currently have and what is missing.',
      prompt: 'What health, accident or life cover do you have today? What would happen if you could not work for 2 months? What is the first gap you will close?',
      placeholder: 'Write your protection check...', minWords: 60
    }
  ])
};

// Fallback if a lesson has no content configured yet
const fallbackSections = (lesson: Lesson): LessonContent[] =>
  build([
    {
      type: 'video', title: lesson.title, duration: '10 min',
      content: lesson.description, searchQuery: `${lesson.title} gig workers India`
    },
    {
      type: 'text', title: 'Overview', duration: '5 min',
      content: lesson.description, takeaway: 'Detailed lesson content for this topic is coming soon.'
    }
  ]);



// Applies the Tax Center cream background to the whole page (body), so no white shows around/behind content
function useLedgerBackground() {
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#F7F3E9";
    return () => { document.body.style.backgroundColor = prev; };
  }, []);
}

// Theme tokens (Tax Center ledger theme)
const card = 'border border-[#D9D0B8] rounded-md bg-[#FCFAF4]';
const btnPrimary = 'bg-[#1B2B44] text-[#F7F3E9] rounded-md font-medium hover:bg-[#243A5E] transition-colors';
const inputCls = 'w-full bg-[#FCFAF4] border border-[#D9D0B8] rounded-md px-3.5 py-2.5 text-[#1B2B44] placeholder:text-[#9A927B] focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/40 transition-colors text-sm';
const pageWrap = 'min-h-screen bg-[#F7F3E9] text-[#1B2B44] pt-20 pb-20 px-6 font-sans';

function FolderHeader({ tab, icon: TabIcon, title, subtitle }: { tab: string; icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="mb-10">
      <div className="inline-flex items-center gap-2 bg-[#1B2B44] text-[#F7F3E9] px-4 py-1.5 rounded-t-md text-xs tracking-wide font-medium">
        <TabIcon size={14} />
        {tab}
      </div>
      <div className="border border-[#D9D0B8] bg-[#FCFAF4] rounded-b-md rounded-tr-md px-8 py-8 shadow-sm">
        <h1 className="font-serif text-4xl md:text-5xl text-[#1B2B44] leading-tight">{title}</h1>
        <p className="text-[#5B5540] mt-3 max-w-lg text-[15px] leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

// ─────────────────────────── Main App ───────────────────────────
export default function GigWorkerFinanceApp() {
  useLedgerBackground();
  const [currentPage, setCurrentPage] = useState<'hub' | 'all-lessons' | 'lesson-detail'>('hub');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);

  const allLessonsData: Lesson[] = [
    {
      id: 1, title: 'Understand Your Income Pattern',
      description: 'Find your baseline income and spot weekly and seasonal trends in irregular earnings',
      duration: '30 min', progress: 40, icon: BarChart, iconColor: '#B8860B', iconBg: '#EFE9D8',
      category: 'Income Analysis', level: 'Beginner', rating: 4.8, students: '9.6k'
    },
    {
      id: 2, title: 'Micro-Savings on Autopilot',
      description: 'Save a small slice of every payout automatically, without tracking each transaction',
      duration: '25 min', progress: 0, icon: PiggyBank, iconColor: '#3F6B4D', iconBg: '#EFE9D8',
      category: 'Micro-Savings', level: 'Beginner', rating: 4.9, students: '8.1k'
    },
    {
      id: 3, title: 'Build Your Safety Net',
      description: 'Size and build an emergency fund that survives slow months',
      duration: '30 min', progress: 20, icon: Wallet, iconColor: '#1B2B44', iconBg: '#EFE9D8',
      category: 'Safety Net', level: 'Beginner', rating: 4.8, students: '10.2k'
    },
    {
      id: 4, title: 'Investing with Irregular Income',
      description: 'Start small with flexible options like SIPs, in the right order',
      duration: '40 min', progress: 0, icon: TrendingUp, iconColor: '#B8860B', iconBg: '#EFE9D8',
      category: 'Investing', level: 'Beginner', rating: 4.7, students: '7.4k'
    },
    {
      id: 5, title: 'Find Your Risk Profile',
      description: 'Match investments to your comfort with risk and your real ability to take it',
      duration: '30 min', progress: 0, icon: Target, iconColor: '#A6432D', iconBg: '#EFE9D8',
      category: 'Investing', level: 'Intermediate', rating: 4.7, students: '5.3k'
    },
    {
      id: 6, title: 'Taxes for Gig Workers',
      description: 'How gig income is taxed, which ITR form to use and what records to keep',
      duration: '35 min', progress: 0, icon: FileText, iconColor: '#1B2B44', iconBg: '#EFE9D8',
      category: 'Tax & Compliance', level: 'Beginner', rating: 4.6, students: '6.8k'
    },
    {
      id: 7, title: 'Advance Tax Made Simple',
      description: 'Build a tax reserve from every payout and avoid year-end surprises',
      duration: '35 min', progress: 0, icon: FileText, iconColor: '#3F6B4D', iconBg: '#EFE9D8',
      category: 'Tax & Compliance', level: 'Intermediate', rating: 4.6, students: '4.2k'
    },
    {
      id: 8, title: 'Insurance for Gig Workers',
      description: 'Protect your savings with health and accident cover you can afford',
      duration: '25 min', progress: 0, icon: ShieldCheck, iconColor: '#A6432D', iconBg: '#EFE9D8',
      category: 'Safety Net', level: 'Intermediate', rating: 4.7, students: '3.9k'
    }
  ];

  const navigateToAllLessons = () => setCurrentPage('all-lessons');
  const navigateToHub = () => setCurrentPage('hub');
  const navigateToLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setCurrentPage('lesson-detail');
  };

  return (
    <>
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {currentPage === 'hub' && (
        <HubPage lessons={allLessonsData} onNavigateToAllLessons={navigateToAllLessons} onNavigateToLesson={navigateToLesson} />
      )}
      {currentPage === 'all-lessons' && (
        <AllLessonsPage lessons={allLessonsData} onNavigateToLesson={navigateToLesson} onNavigateBack={navigateToHub} />
      )}
      {currentPage === 'lesson-detail' && (
        <LessonDetailPage lesson={allLessonsData.find(l => l.id === selectedLessonId)!} onNavigateBack={navigateToHub} />
      )}
    </>
  );
}

// ─────────────────────────── Shared lesson card ───────────────────────────
function LessonCard({ lesson, onOpen, showLevel = false }: { lesson: Lesson; onOpen: () => void; showLevel?: boolean }) {
  const Icon = lesson.icon;
  return (
    <div
      onClick={onOpen}
      className={`${card} p-6 cursor-pointer transition-colors hover:border-[#B8860B] group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-md flex items-center justify-center" style={{ backgroundColor: lesson.iconBg }}>
          <Icon className="w-6 h-6" style={{ color: lesson.iconColor }} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[11px] uppercase tracking-wide font-medium text-[#8A8371]">{lesson.category}</span>
          {showLevel && <span className="text-[11px] font-medium text-[#B8860B]">{lesson.level}</span>}
        </div>
      </div>

      <h3 className="font-serif text-xl text-[#1B2B44] leading-tight mb-2 group-hover:text-[#B8860B] transition-colors">
        {lesson.title}
      </h3>
      <p className="text-sm text-[#5B5540] mb-4 leading-relaxed line-clamp-2">{lesson.description}</p>

      <div className="flex items-center justify-between text-xs text-[#8A8371] mb-3 pt-3 border-t border-dotted border-[#C9BF9F]">
        <span className="flex items-center gap-1.5"><Clock size={13} />{lesson.duration}</span>
        {showLevel ? (
          <span>{lesson.rating} ★ · {lesson.students} learners</span>
        ) : (
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-[#B8860B]" />
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#EFE9D8] rounded-full overflow-hidden">
          <div className="h-full bg-[#B8860B] rounded-full transition-all duration-500" style={{ width: `${lesson.progress}%` }} />
        </div>
        <span className="text-xs font-medium text-[#1B2B44] tabular-nums min-w-[36px] text-right">{lesson.progress}%</span>
      </div>

      {showLevel && (
        <button className={`${btnPrimary} w-full mt-4 py-2.5 flex items-center justify-center gap-2`}>
          {lesson.progress > 0 ? 'Continue learning' : 'Start lesson'}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────── Hub Page ───────────────────────────
const PILLARS = [
  { icon: BarChart, title: 'Analyse Income', text: 'Spot your baseline, peak days and seasonal dips.' },
  { icon: PiggyBank, title: 'Auto Micro-Savings', text: 'A small slice of every payout is set aside for you.' },
  { icon: TrendingUp, title: 'Smart Investing', text: 'Options matched to your behaviour and risk profile.' },
  { icon: FileText, title: 'Tax Assistance', text: 'Track tax money and stay ready for filing.' }
];

function HubPage({
  lessons, onNavigateToAllLessons, onNavigateToLesson
}: {
  lessons: Lesson[];
  onNavigateToAllLessons: () => void;
  onNavigateToLesson: (id: number) => void;
}) {
  const continueLearning = lessons.filter(l => l.progress > 0 && l.progress < 100).slice(0, 3);
  const avg = Math.round(lessons.reduce((a, l) => a + l.progress, 0) / lessons.length);

  return (
    <main className={pageWrap} style={{ backgroundColor: '#F7F3E9' }}>
      <div className="max-w-6xl mx-auto">
        <FolderHeader
          tab="Finance Hub"
          icon={ScrollText}
          title="Turn irregular earnings into steady progress"
          subtitle="Lessons on savings, smarter investments and stress-free taxes, built for gig workers."
        />

        {/* Pillars */}
        <div className={`grid sm:grid-cols-2 lg:grid-cols-4 ${card} mb-6 divide-y sm:divide-y-0 lg:divide-x divide-[#D9D0B8]`}>
          {PILLARS.map(p => {
            const PIcon = p.icon;
            return (
              <div key={p.title} className="p-6">
                <PIcon size={18} className="text-[#B8860B] mb-3" />
                <p className="font-serif text-lg text-[#1B2B44] mb-1">{p.title}</p>
                <p className="text-sm text-[#5B5540] leading-relaxed">{p.text}</p>
              </div>
            );
          })}
        </div>

        {/* Ledger summary strip */}
        <div className={`grid sm:grid-cols-3 ${card} mb-12 divide-y sm:divide-y-0 sm:divide-x divide-[#D9D0B8]`}>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">Total lessons</p>
            <p className="font-serif text-3xl text-[#1B2B44] tabular-nums">{lessons.length}</p>
            <p className="text-sm text-[#8A8371] mt-1">across 5 categories</p>
          </div>
          <div className="p-6">
            <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-2">In progress</p>
            <p className="font-serif text-3xl text-[#A6432D] tabular-nums">{continueLearning.length}</p>
            <p className="text-sm text-[#8A8371] mt-1">lessons waiting for you</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-[#8A8371]">Completion rate</p>
              <BookOpen size={14} className="text-[#B8860B]" />
            </div>
            <p className="font-serif text-3xl text-[#1B2B44] tabular-nums">{avg}%</p>
            <div className="h-1.5 bg-[#EFE9D8] rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#B8860B] rounded-full transition-all duration-500" style={{ width: `${avg}%` }} />
            </div>
          </div>
        </div>

        {continueLearning.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl text-[#1B2B44]">Continue learning</h2>
              <button onClick={onNavigateToAllLessons} className="text-sm font-medium text-[#B8860B] hover:text-[#8F6A08] flex items-center gap-1 transition-colors">
                View all <ChevronRight size={15} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueLearning.map(l => <LessonCard key={l.id} lesson={l} onOpen={() => onNavigateToLesson(l.id)} />)}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl text-[#1B2B44]">All lessons</h2>
            <button onClick={onNavigateToAllLessons} className={`${card} px-4 py-2 text-sm font-medium text-[#1B2B44] hover:border-[#B8860B] transition-colors`}>
              Browse all categories
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.slice(0, 6).map(l => <LessonCard key={l.id} lesson={l} onOpen={() => onNavigateToLesson(l.id)} />)}
          </div>
        </section>
      </div>
    </main>
  );
}

// ─────────────────────────── All Lessons Page ───────────────────────────
function AllLessonsPage({
  lessons, onNavigateToLesson, onNavigateBack
}: {
  lessons: Lesson[];
  onNavigateToLesson: (id: number) => void;
  onNavigateBack: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const categories = ['All', 'Income Analysis', 'Micro-Savings', 'Safety Net', 'Investing', 'Tax & Compliance'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLessons = lessons.filter(lesson => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = lesson.title.toLowerCase().includes(q) || lesson.description.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || lesson.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory('All'); setSelectedLevel('All'); };
  const hasFilters = searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All';

  const stats = [
    { label: 'Total lessons', value: lessons.length },
    { label: 'Categories', value: categories.length - 1 },
    { label: 'In progress', value: lessons.filter(l => l.progress > 0 && l.progress < 100).length },
    { label: 'Completed', value: lessons.filter(l => l.progress === 100).length }
  ];

  return (
    <main className={pageWrap} style={{ backgroundColor: '#F7F3E9' }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={onNavigateBack} className="flex items-center gap-2 text-sm text-[#5B5540] hover:text-[#B8860B] font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to hub
        </button>

        <FolderHeader
          tab="All Lessons"
          icon={BookOpen}
          title="Every lesson, in one index"
          subtitle="Income, savings, investing and tax lessons built for irregular earnings."
        />

        <div className={`grid grid-cols-2 md:grid-cols-4 ${card} mb-8 divide-x divide-[#D9D0B8]`}>
          {stats.map(s => (
            <div key={s.label} className="p-5">
              <p className="text-xs uppercase tracking-wide text-[#8A8371] mb-1">{s.label}</p>
              <p className="font-serif text-3xl text-[#1B2B44] tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        <div className={`${card} p-6 mb-8`}>
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A927B]" size={16} />
              <input
                type="text"
                placeholder="Search lessons (e.g. tax, SIP, savings)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputCls} pl-10`}
              />
            </div>
            <div className="md:col-span-3">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputCls}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
              <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className={inputCls}>
                {levels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <Filter size={13} className="text-[#B8860B]" />
              {searchQuery && <span className="border border-[#D9D0B8] bg-[#EFE9D8] text-[#1B2B44] px-2.5 py-1 rounded-md">Search: "{searchQuery}"</span>}
              {selectedCategory !== 'All' && <span className="border border-[#D9D0B8] bg-[#EFE9D8] text-[#1B2B44] px-2.5 py-1 rounded-md">{selectedCategory}</span>}
              {selectedLevel !== 'All' && <span className="border border-[#D9D0B8] bg-[#EFE9D8] text-[#1B2B44] px-2.5 py-1 rounded-md">{selectedLevel}</span>}
              <button onClick={clearFilters} className="text-[#A6432D] hover:text-[#7E3120] font-medium underline ml-1">Clear all</button>
            </div>
          )}
        </div>

        <p className="text-sm text-[#8A8371] mb-6">
          Showing <span className="text-[#1B2B44] font-medium">{filteredLessons.length}</span> of {lessons.length} lessons
        </p>

        {filteredLessons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map(l => <LessonCard key={l.id} lesson={l} showLevel onOpen={() => onNavigateToLesson(l.id)} />)}
          </div>
        ) : (
          <div className={`${card} p-12 text-center`}>
            <BookOpen className="mx-auto text-[#B8860B] mb-3" size={28} />
            <h3 className="font-serif text-2xl text-[#1B2B44] mb-1">No lessons found</h3>
            <p className="text-sm text-[#8A8371] mb-6">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className={`${btnPrimary} px-6 py-2.5`}>Clear filters</button>
          </div>
        )}
      </div>
    </main>
  );
}

// ─────────────────────────── YouTube player ───────────────────────────
function YouTubeVideoPlayer({ youtubeId, title, searchQuery }: { youtubeId?: string; title: string; searchQuery?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!youtubeId) {
    const query = encodeURIComponent(searchQuery || title);
    return (
      <div className="relative bg-[#1B2B44] aspect-video flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 bg-[#F7F3E9]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Youtube className="w-7 h-7 text-[#F7F3E9]/80" />
          </div>
          <p className="font-serif text-xl text-[#F7F3E9] mb-1">{title}</p>
          <p className="text-[#F7F3E9]/60 text-sm mb-5">
            No video is linked to this section yet. Search YouTube for a video on this topic.
          </p>
          <a
            href={`https://www.youtube.com/results?search_query=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#B8860B] hover:bg-[#9C7209] text-white px-5 py-2.5 rounded-md font-medium transition-colors"
          >
            <Search size={15} />
            Find a video on YouTube
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <button onClick={() => setIsPlaying(true)} aria-label={`Play video: ${title}`} className="relative w-full aspect-video group block bg-black">
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`; }}
        />
        <div className="absolute inset-0 bg-[#1B2B44]/40 group-hover:bg-[#1B2B44]/25 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-[#B8860B] rounded-full flex items-center justify-center group-hover:bg-[#9C7209] group-hover:scale-105 transition shadow-2xl">
            <Play className="w-10 h-10 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="text-[#F7F3E9] font-medium text-sm bg-[#1B2B44]/70 px-3 py-1.5 rounded-md backdrop-blur-sm">{title}</span>
          <span className="flex items-center gap-1.5 text-[#F7F3E9] text-xs bg-[#1B2B44]/70 px-2.5 py-1.5 rounded-md backdrop-blur-sm">
            <Youtube size={13} /> YouTube
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// ─────────────────────────── Lesson Detail Page ───────────────────────────
function LessonDetailPage({ lesson, onNavigateBack }: { lesson: Lesson; onNavigateBack: () => void }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  const sections: LessonContent[] = LESSON_CONTENT[lesson.id] ?? fallbackSections(lesson);

  const markComplete = () => {
    if (!completedSections.includes(currentSection)) setCompletedSections([...completedSections, currentSection]);
    if (currentSection < sections.length - 1) setCurrentSection(currentSection + 1);
  };
  const selectQuizAnswer = (key: string, i: number) => {
    if (quizChecked[key]) return;
    setQuizAnswers(prev => ({ ...prev, [key]: i }));
  };
  const checkQuizAnswer = (key: string) => setQuizChecked(prev => ({ ...prev, [key]: true }));
  const submitAssignment = () => {
    setAssignmentSubmitted(true);
    if (!completedSections.includes(currentSection)) setCompletedSections([...completedSections, currentSection]);
  };

  const currentContent = sections[currentSection];
  const progressPercentage = (completedSections.length / sections.length) * 100;
  const wordCount = assignmentText.trim().length === 0 ? 0 : assignmentText.trim().split(/\s+/).length;
  const minWords = currentContent.minWords ?? 60;

  const sectionIcon = (type: LessonContent['type']) => {
    if (type === 'video') return Play;
    if (type === 'text') return BookOpen;
    if (type === 'quiz') return Award;
    return PenSquare;
  };

  return (
    <main className={pageWrap} style={{ backgroundColor: '#F7F3E9' }}>
      <div className="max-w-6xl mx-auto">
        <button onClick={onNavigateBack} className="flex items-center gap-2 text-sm text-[#5B5540] hover:text-[#B8860B] font-medium mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to lessons
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson header */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1B2B44] text-[#F7F3E9] px-4 py-1.5 rounded-t-md text-xs tracking-wide font-medium">
                <ScrollText size={14} />
                {lesson.category}
              </div>
              <div className="border border-[#D9D0B8] bg-[#FCFAF4] rounded-b-md rounded-tr-md px-8 py-8 shadow-sm">
                <h1 className="font-serif text-3xl md:text-4xl text-[#1B2B44] leading-tight mb-2">{lesson.title}</h1>
                <p className="text-[#5B5540] text-[15px] leading-relaxed">{lesson.description}</p>

                <div className="flex flex-wrap gap-6 mt-6 pt-5 border-t border-dotted border-[#C9BF9F] text-sm text-[#5B5540]">
                  <span className="flex items-center gap-2"><Clock size={16} className="text-[#B8860B]" />{lesson.duration}</span>
                  <span className="flex items-center gap-2"><BookOpen size={16} className="text-[#B8860B]" />{lesson.level}</span>
                  <span className="flex items-center gap-2"><Award size={16} className="text-[#B8860B]" />{lesson.rating} ★ ({lesson.students} learners)</span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs uppercase tracking-wide text-[#8A8371]">Your progress</span>
                    <span className="text-sm font-medium text-[#1B2B44] tabular-nums">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="h-1.5 bg-[#EFE9D8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#B8860B] rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Content panel */}
            <div className={`${card} overflow-hidden`}>
              {currentContent.type === 'video' ? (
                <>
                  <YouTubeVideoPlayer
                    key={`${lesson.id}-${currentContent.id}`}
                    youtubeId={currentContent.youtubeId}
                    title={currentContent.title}
                    searchQuery={currentContent.searchQuery}
                  />
                  {currentContent.content && (
                    <div className="p-6">
                      <h2 className="font-serif text-2xl text-[#1B2B44] mb-1">{currentContent.title}</h2>
                      <p className="text-[#5B5540]">{currentContent.content}</p>
                    </div>
                  )}
                </>
              ) : currentContent.type === 'text' ? (
                <div className="p-8">
                  <h2 className="font-serif text-2xl text-[#1B2B44] mb-4">{currentContent.title}</h2>
                  <p className="text-[#5B5540] leading-relaxed text-[17px] mb-6">{currentContent.content}</p>

                  {currentContent.takeaway && (
                    <div className="border-l-2 border-[#B8860B] bg-[#F7F3E9] pl-5 pr-4 py-4 mb-6">
                      <h3 className="text-xs uppercase tracking-wide text-[#B8860B] font-semibold mb-1">Key takeaway</h3>
                      <p className="text-[#1B2B44]">{currentContent.takeaway}</p>
                    </div>
                  )}

                  {currentContent.points && (
                    <>
                      <h3 className="font-serif text-xl text-[#1B2B44] mb-3">{currentContent.pointsHeading}</h3>
                      <ul className="divide-y divide-[#E7E0CC] mb-6">
                        {currentContent.points.map(p => (
                          <li key={p.label} className="flex items-start gap-3 py-3">
                            <CheckCircle size={17} className="text-[#3F6B4D] mt-0.5 flex-shrink-0" />
                            <div className="text-[15px]">
                              <strong className="font-serif text-[#1B2B44]">{p.label}:</strong>
                              <span className="text-[#5B5540]"> {p.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {currentContent.disclaimer && (
                    <div className="flex items-start gap-3 border border-[#D9D0B8] bg-[#F7F3E9] rounded-md p-4 text-sm text-[#5B5540]">
                      <AlertTriangle size={17} className="flex-shrink-0 mt-0.5 text-[#B8860B]" />
                      <p>{currentContent.disclaimer}</p>
                    </div>
                  )}
                </div>
              ) : currentContent.type === 'quiz' ? (
                <div className="p-8">
                  <h2 className="font-serif text-2xl text-[#1B2B44] mb-1">{currentContent.title}</h2>
                  <p className="text-sm text-[#8A8371] mb-6">Pick an answer, then check it — you'll get an explanation either way.</p>
                  <div className="space-y-6">
                    {currentContent.questions?.map((q, qIndex) => {
                      const key = `${currentContent.id}-${q.id}`;
                      const selected = quizAnswers[key];
                      const checked = quizChecked[key];
                      return (
                        <div key={key} className="border border-[#D9D0B8] rounded-md p-5 bg-[#FCFAF4]">
                          <p className="font-serif text-lg text-[#1B2B44] mb-4">{qIndex + 1}. {q.question}</p>
                          <div className="space-y-2 mb-4">
                            {q.options.map((option, optIndex) => {
                              const isSelected = selected === optIndex;
                              const isCorrectOption = optIndex === q.correctAnswer;
                              let state = 'border-[#D9D0B8] hover:border-[#B8860B]';
                              if (checked && isCorrectOption) state = 'border-[#3F6B4D] bg-[#3F6B4D]/10';
                              else if (checked && isSelected && !isCorrectOption) state = 'border-[#A6432D] bg-[#A6432D]/10';
                              else if (isSelected) state = 'border-[#B8860B] bg-[#B8860B]/10';
                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => selectQuizAnswer(key, optIndex)}
                                  disabled={checked}
                                  className={`w-full text-left p-3.5 rounded-md border transition-colors flex items-center justify-between gap-3 ${state} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                  <span className="text-sm text-[#1B2B44]">{option}</span>
                                  {checked && isCorrectOption && <CheckCircle size={17} className="text-[#3F6B4D] flex-shrink-0" />}
                                  {checked && isSelected && !isCorrectOption && <XCircle size={17} className="text-[#A6432D] flex-shrink-0" />}
                                </button>
                              );
                            })}
                          </div>

                          {!checked ? (
                            <button
                              onClick={() => checkQuizAnswer(key)}
                              disabled={selected === undefined}
                              className={`${btnPrimary} px-5 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed`}
                            >
                              Check answer
                            </button>
                          ) : (
                            <div className={`border-l-2 pl-3 py-1 text-sm text-[#4A4433] ${selected === q.correctAnswer ? 'border-[#3F6B4D]' : 'border-[#A6432D]'}`}>
                              <p className={`font-medium mb-1 ${selected === q.correctAnswer ? 'text-[#3F6B4D]' : 'text-[#A6432D]'}`}>
                                {selected === q.correctAnswer ? 'Correct!' : "Not quite — here's why:"}
                              </p>
                              <p>{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-1">
                    <PenSquare size={18} className="text-[#B8860B]" />
                    <h2 className="font-serif text-2xl text-[#1B2B44]">{currentContent.title}</h2>
                  </div>
                  <p className="text-[#5B5540] leading-relaxed my-4">{currentContent.instructions}</p>

                  <div className="border-l-2 border-[#B8860B] bg-[#F7F3E9] pl-5 pr-4 py-4 mb-6">
                    <h3 className="text-xs uppercase tracking-wide text-[#B8860B] font-semibold mb-1">Prompt</h3>
                    <p className="text-[#1B2B44]">{currentContent.prompt}</p>
                  </div>

                  {!assignmentSubmitted ? (
                    <>
                      <textarea
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        placeholder={currentContent.placeholder ?? 'Start writing here...'}
                        rows={8}
                        className={`${inputCls} leading-relaxed resize-y`}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-sm tabular-nums ${wordCount >= minWords ? 'text-[#3F6B4D] font-medium' : 'text-[#8A8371]'}`}>
                          {wordCount} / {minWords} words
                        </span>
                        <button
                          onClick={submitAssignment}
                          disabled={wordCount === 0}
                          className={`${btnPrimary} flex items-center gap-2 px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          <Send size={15} />
                          Submit assignment
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="border border-[#3F6B4D]/40 bg-[#3F6B4D]/10 rounded-md p-6 text-center">
                      <CheckCircle size={36} className="text-[#3F6B4D] mx-auto mb-3" />
                      <h3 className="font-serif text-xl text-[#1B2B44] mb-1">Assignment submitted</h3>
                      <p className="text-[#5B5540] text-sm mb-4">Nice work — your {wordCount}-word response has been recorded for this lesson.</p>
                      <button onClick={() => setAssignmentSubmitted(false)} className="text-[#B8860B] hover:text-[#8F6A08] font-medium text-sm underline">
                        Edit my submission
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 bg-[#F7F3E9] border-t border-[#D9D0B8] flex justify-between items-center">
                <button
                  onClick={() => currentSection > 0 && setCurrentSection(currentSection - 1)}
                  disabled={currentSection === 0}
                  className="px-5 py-2.5 border border-[#D9D0B8] bg-[#FCFAF4] text-[#1B2B44] rounded-md font-medium hover:border-[#B8860B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {currentContent.type !== 'assignment' && (
                  <button onClick={markComplete} className={`${btnPrimary} px-6 py-2.5 flex items-center gap-2`}>
                    {currentSection === sections.length - 1 ? 'Complete lesson' : 'Mark complete & continue'}
                    <ChevronRight size={16} />
                  </button>
                )}
                {currentContent.type === 'assignment' && assignmentSubmitted && currentSection < sections.length - 1 && (
                  <button onClick={() => setCurrentSection(currentSection + 1)} className={`${btnPrimary} px-6 py-2.5 flex items-center gap-2`}>
                    Continue <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${card} p-6 sticky top-24`}>
              <h3 className="font-serif text-xl text-[#1B2B44] mb-4">Lesson content</h3>
              <div className="space-y-2">
                {sections.map((section, index) => {
                  const Icon = sectionIcon(section.type);
                  const active = currentSection === index;
                  return (
                    <div
                      key={section.id}
                      onClick={() => setCurrentSection(index)}
                      className={`p-3.5 rounded-md cursor-pointer transition-colors border ${
                        active ? 'border-[#B8860B] bg-[#B8860B]/10' : 'border-[#E7E0CC] hover:border-[#B8860B]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {completedSections.includes(index)
                            ? <CheckCircle size={17} className="text-[#3F6B4D]" />
                            : <Circle size={17} className="text-[#C9BF9F]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm mb-1 ${active ? 'text-[#8F6A08]' : 'text-[#1B2B44]'}`}>{section.title}</p>
                          <div className="flex items-center gap-2 text-xs text-[#8A8371]">
                            <Icon size={12} />
                            <span>{section.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-[#E7E0CC] space-y-3">
                <button className="w-full px-4 py-2.5 border border-[#D9D0B8] bg-[#FCFAF4] text-[#1B2B44] rounded-md font-medium hover:border-[#B8860B] transition-colors flex items-center justify-center gap-2">
                  <Download size={16} /> Download resources
                </button>
                <button className="w-full px-4 py-2.5 border border-[#D9D0B8] bg-[#FCFAF4] text-[#1B2B44] rounded-md font-medium hover:border-[#B8860B] transition-colors flex items-center justify-center gap-2">
                  <Share2 size={16} /> Share lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}