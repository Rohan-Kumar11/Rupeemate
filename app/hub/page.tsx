"use client";
import React, { useState } from 'react';
import {
  Search, Filter, TrendingUp, FileText, Wallet, PiggyBank, Clock, ChevronRight, BookOpen,
  Target, Award, BarChart, ArrowLeft, Play, CheckCircle, Circle, Download, Share2, Youtube,
  PenSquare, ExternalLink, XCircle, Send, ShieldCheck, AlertTriangle
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

// ─────────────────────────── Main App ───────────────────────────
export default function GigWorkerFinanceApp() {
  const [currentPage, setCurrentPage] = useState<'hub' | 'all-lessons' | 'lesson-detail'>('hub');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);

  const allLessonsData: Lesson[] = [
    {
      id: 1, title: 'Understand Your Income Pattern',
      description: 'Find your baseline income and spot weekly and seasonal trends in irregular earnings',
      duration: '30 min', progress: 40, icon: BarChart, iconColor: '#10b981', iconBg: '#dcfce7',
      category: 'Income Analysis', level: 'Beginner', rating: 4.8, students: '9.6k'
    },
    {
      id: 2, title: 'Micro-Savings on Autopilot',
      description: 'Save a small slice of every payout automatically, without tracking each transaction',
      duration: '25 min', progress: 0, icon: PiggyBank, iconColor: '#ec4899', iconBg: '#fce7f3',
      category: 'Micro-Savings', level: 'Beginner', rating: 4.9, students: '8.1k'
    },
    {
      id: 3, title: 'Build Your Safety Net',
      description: 'Size and build an emergency fund that survives slow months',
      duration: '30 min', progress: 20, icon: Wallet, iconColor: '#8b5cf6', iconBg: '#ede9fe',
      category: 'Safety Net', level: 'Beginner', rating: 4.8, students: '10.2k'
    },
    {
      id: 4, title: 'Investing with Irregular Income',
      description: 'Start small with flexible options like SIPs, in the right order',
      duration: '40 min', progress: 0, icon: TrendingUp, iconColor: '#3b82f6', iconBg: '#dbeafe',
      category: 'Investing', level: 'Beginner', rating: 4.7, students: '7.4k'
    },
    {
      id: 5, title: 'Find Your Risk Profile',
      description: 'Match investments to your comfort with risk and your real ability to take it',
      duration: '30 min', progress: 0, icon: Target, iconColor: '#14b8a6', iconBg: '#ccfbf1',
      category: 'Investing', level: 'Intermediate', rating: 4.7, students: '5.3k'
    },
    {
      id: 6, title: 'Taxes for Gig Workers',
      description: 'How gig income is taxed, which ITR form to use and what records to keep',
      duration: '35 min', progress: 0, icon: FileText, iconColor: '#f59e0b', iconBg: '#fef3c7',
      category: 'Tax & Compliance', level: 'Beginner', rating: 4.6, students: '6.8k'
    },
    {
      id: 7, title: 'Advance Tax Made Simple',
      description: 'Build a tax reserve from every payout and avoid year-end surprises',
      duration: '35 min', progress: 0, icon: FileText, iconColor: '#10b981', iconBg: '#dcfce7',
      category: 'Tax & Compliance', level: 'Intermediate', rating: 4.6, students: '4.2k'
    },
    {
      id: 8, title: 'Insurance for Gig Workers',
      description: 'Protect your savings with health and accident cover you can afford',
      duration: '25 min', progress: 0, icon: ShieldCheck, iconColor: '#ec4899', iconBg: '#fce7f3',
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {currentPage === 'hub' && (
        <HubPage
          lessons={allLessonsData}
          onNavigateToAllLessons={navigateToAllLessons}
          onNavigateToLesson={navigateToLesson}
        />
      )}
      {currentPage === 'all-lessons' && (
        <AllLessonsPage
          lessons={allLessonsData}
          onNavigateToLesson={navigateToLesson}
          onNavigateBack={navigateToHub}
        />
      )}
      {currentPage === 'lesson-detail' && (
        <LessonDetailPage
          lesson={allLessonsData.find(l => l.id === selectedLessonId)!}
          onNavigateBack={navigateToHub}
        />
      )}
    </>
  );
}

// ─────────────────────────── Hub Page ───────────────────────────
const PILLARS = [
  { icon: BarChart, title: 'Analyse Income', text: 'Spot your baseline, peak days and seasonal dips.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: PiggyBank, title: 'Auto Micro-Savings', text: 'A small slice of every payout is set aside for you.', color: 'text-pink-600', bg: 'bg-pink-50' },
  { icon: TrendingUp, title: 'Smart Investing', text: 'Options matched to your behaviour and risk profile.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: FileText, title: 'Tax Assistance', text: 'Track tax money and stay ready for filing.', color: 'text-amber-600', bg: 'bg-amber-50' }
];

function HubPage({
  lessons,
  onNavigateToAllLessons,
  onNavigateToLesson
}: {
  lessons: Lesson[];
  onNavigateToAllLessons: () => void;
  onNavigateToLesson: (id: number) => void;
}) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const continueLearning = lessons.filter(l => l.progress > 0 && l.progress < 100).slice(0, 3);

  const LessonCard = ({ lesson, compact = false }: { lesson: Lesson; compact?: boolean }) => {
    const Icon = lesson.icon;
    const isHovered = hoveredCard === lesson.id;

    return (
      <div
        onMouseEnter={() => setHoveredCard(lesson.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => onNavigateToLesson(lesson.id)}
        className="bg-white rounded-2xl p-7 cursor-pointer transition-all duration-200 hover:shadow-2xl shadow-md border border-gray-100 hover:border-emerald-200 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-16 -mt-16"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200 group-hover:shadow-md"
              style={{ backgroundColor: lesson.iconBg }}
            >
              <Icon className="w-8 h-8" style={{ color: lesson.iconColor }} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              {lesson.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2.5 leading-tight group-hover:text-emerald-600 transition-colors duration-200">
            {lesson.title}
          </h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2">
            {lesson.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{lesson.duration}</span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-gray-400 transition-all duration-200 ${isHovered ? 'translate-x-1 text-emerald-500' : ''}`}
            />
          </div>

          {compact ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600">Progress</span>
                <span className="text-emerald-600">{lesson.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${lesson.progress}%`, background: `linear-gradient(90deg, ${lesson.iconColor}, ${lesson.iconColor}dd)` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${lesson.progress}%`, background: `linear-gradient(90deg, ${lesson.iconColor}, ${lesson.iconColor}dd)` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-600 min-w-[45px] text-right">{lesson.progress}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Gig Worker Finance Hub
              </h1>
            </div>
            <p className="text-lg text-gray-600 font-medium sm:ml-[60px]">
              Turn irregular earnings into steady savings, smarter investments and stress-free taxes
            </p>
          </div>

          {/* What the platform does */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PILLARS.map(p => {
              const PIcon = p.icon;
              return (
                <div key={p.title} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${p.bg} rounded-lg flex items-center justify-center mb-3`}>
                    <PIcon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <p className="font-bold text-gray-900 mb-1">{p.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.text}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Lessons</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{continueLearning.length}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(lessons.reduce((acc, l) => acc + l.progress, 0) / lessons.length)}%
                  </p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {continueLearning.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Continue Learning</h2>
              <button
                onClick={onNavigateToAllLessons}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueLearning.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} compact={true} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">All Lessons</h2>
            <button
              onClick={onNavigateToAllLessons}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse All Categories
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.slice(0, 6).map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── All Lessons Page ───────────────────────────
function AllLessonsPage({
  lessons,
  onNavigateToLesson,
  onNavigateBack
}: {
  lessons: Lesson[];
  onNavigateToLesson: (id: number) => void;
  onNavigateBack: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const categories = ['All', 'Income Analysis', 'Micro-Savings', 'Safety Net', 'Investing', 'Tax & Compliance'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || lesson.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
  };

  const LessonCard = ({ lesson }: { lesson: Lesson }) => {
    const Icon = lesson.icon;
    const isHovered = hoveredCard === lesson.id;

    return (
      <div
        onMouseEnter={() => setHoveredCard(lesson.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => onNavigateToLesson(lesson.id)}
        className="bg-white rounded-2xl p-7 cursor-pointer transition-all duration-200 hover:shadow-2xl shadow-md border border-gray-100 hover:border-emerald-200 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-16 -mt-16"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200 group-hover:shadow-md"
              style={{ backgroundColor: lesson.iconBg }}
            >
              <Icon className="w-8 h-8" style={{ color: lesson.iconColor }} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">{lesson.category}</span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">{lesson.level}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2.5 leading-tight group-hover:text-emerald-600 transition-colors duration-200">
            {lesson.title}
          </h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2">{lesson.description}</p>

          <div className="flex items-center justify-between mb-5 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{lesson.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{lesson.rating}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-medium">{lesson.students} learners</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${lesson.progress}%`, background: `linear-gradient(90deg, ${lesson.iconColor}, ${lesson.iconColor}dd)` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-600 min-w-[45px] text-right">{lesson.progress}%</span>
          </div>

          <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg flex items-center justify-center gap-2 group-hover:shadow-xl">
            {lesson.progress > 0 ? 'Continue Learning' : 'Start Lesson'}
            <ChevronRight className={`w-5 h-5 transition-all duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 pt-24 pb-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Hub
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">All Lessons</h1>
          </div>
          <p className="text-lg text-gray-600 font-medium sm:ml-[60px]">
            Income, savings, investing and tax lessons built for irregular earnings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpen, bg: 'bg-emerald-50', color: 'text-emerald-600', value: lessons.length, label: 'Total Lessons' },
            { icon: Filter, bg: 'bg-teal-50', color: 'text-teal-600', value: categories.length - 1, label: 'Categories' },
            { icon: Target, bg: 'bg-emerald-50', color: 'text-emerald-600', value: lessons.filter(l => l.progress > 0 && l.progress < 100).length, label: 'In Progress' },
            { icon: Award, bg: 'bg-teal-50', color: 'text-teal-600', value: lessons.filter(l => l.progress === 100).length, label: 'Completed' }
          ].map(stat => {
            const SIcon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <SIcon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lessons (e.g. tax, SIP, savings)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition font-semibold text-gray-700"
              >
                {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div className="md:col-span-3">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition font-semibold text-gray-700"
              >
                {levels.map(level => (<option key={level} value={level}>{level}</option>))}
              </select>
            </div>
          </div>

          {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">Search: "{searchQuery}"</span>
              )}
              {selectedCategory !== 'All' && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">Category: {selectedCategory}</span>
              )}
              {selectedLevel !== 'All' && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">Level: {selectedLevel}</span>
              )}
              <button onClick={clearFilters} className="text-gray-600 hover:text-emerald-600 px-3 py-1 text-sm font-semibold underline">
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600 font-semibold">
            Showing <span className="text-emerald-600">{filteredLessons.length}</span> of <span className="text-emerald-600">{lessons.length}</span> lessons
          </p>
        </div>

        {filteredLessons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (<LessonCard key={lesson.id} lesson={lesson} />))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── YouTube player ───────────────────────────
// Shows a thumbnail and only loads the iframe after the person clicks Play.
// Falls back to a "search on YouTube" card when no youtubeId is set.
function YouTubeVideoPlayer({
  youtubeId,
  title,
  searchQuery
}: {
  youtubeId?: string;
  title: string;
  searchQuery?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!youtubeId) {
    const query = encodeURIComponent(searchQuery || title);
    return (
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Youtube className="w-8 h-8 text-white/80" />
          </div>
          <p className="text-white font-semibold text-lg mb-1">{title}</p>
          <p className="text-gray-400 text-sm mb-5">
            No video is linked to this section yet. Search YouTube for a video on this topic.
          </p>
          <a
            href={`https://www.youtube.com/results?search_query=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
          >
            <Search className="w-4 h-4" />
            Find a video on YouTube
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <button
        onClick={() => setIsPlaying(true)}
        aria-label={`Play video: ${title}`}
        className="relative w-full aspect-video group block bg-black"
      >
        <img
          src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center group-hover:bg-emerald-600 group-hover:scale-105 transition shadow-2xl">
            <Play className="w-10 h-10 text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">{title}</span>
          <span className="flex items-center gap-1.5 text-white text-xs bg-black/50 px-2.5 py-1.5 rounded-lg backdrop-blur-sm">
            <Youtube className="w-3.5 h-3.5" />
            YouTube
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
function LessonDetailPage({
  lesson,
  onNavigateBack
}: {
  lesson: Lesson;
  onNavigateBack: () => void;
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([0]);

  // Quiz state, keyed by "sectionId-questionId" so multiple quizzes can't collide
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  // Assignment state
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  const sections: LessonContent[] = LESSON_CONTENT[lesson.id] ?? fallbackSections(lesson);

  const markComplete = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const selectQuizAnswer = (key: string, optionIndex: number) => {
    if (quizChecked[key]) return;
    setQuizAnswers(prev => ({ ...prev, [key]: optionIndex }));
  };

  const checkQuizAnswer = (key: string) => {
    setQuizChecked(prev => ({ ...prev, [key]: true }));
  };

  const submitAssignment = () => {
    setAssignmentSubmitted(true);
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 pt-20 pb-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lessons
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {lesson.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">{lesson.title}</h1>
              <p className="text-gray-600 text-lg">{lesson.description}</p>

              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold">{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold">{lesson.level}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold">{lesson.rating} ★ ({lesson.students} learners)</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                  <span className="text-sm font-bold text-emerald-600">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{currentContent.title}</h2>
                      <p className="text-gray-600">{currentContent.content}</p>
                    </div>
                  )}
                </>
              ) : currentContent.type === 'text' ? (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentContent.title}</h2>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">{currentContent.content}</p>

                  {currentContent.takeaway && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-6">
                      <h3 className="font-bold text-emerald-900 mb-2">Key Takeaway</h3>
                      <p className="text-emerald-800">{currentContent.takeaway}</p>
                    </div>
                  )}

                  {currentContent.points && (
                    <>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{currentContent.pointsHeading}</h3>
                      <ul className="space-y-3 mb-6">
                        {currentContent.points.map(p => (
                          <li key={p.label} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                            <div>
                              <strong className="text-gray-900">{p.label}:</strong>
                              <span className="text-gray-700"> {p.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {currentContent.disclaimer && (
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{currentContent.disclaimer}</p>
                    </div>
                  )}
                </div>
              ) : currentContent.type === 'quiz' ? (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentContent.title}</h2>
                  <p className="text-gray-500 mb-6">Pick an answer, then check it — you'll get an explanation either way.</p>
                  <div className="space-y-6">
                    {currentContent.questions?.map((q, qIndex) => {
                      const key = `${currentContent.id}-${q.id}`;
                      const selected = quizAnswers[key];
                      const checked = quizChecked[key];
                      return (
                        <div key={key} className="border-2 border-gray-100 rounded-xl p-5">
                          <p className="font-semibold text-gray-900 mb-4">{qIndex + 1}. {q.question}</p>
                          <div className="space-y-2 mb-4">
                            {q.options.map((option, optIndex) => {
                              const isSelected = selected === optIndex;
                              const isCorrectOption = optIndex === q.correctAnswer;
                              let stateClasses = 'border-gray-200 hover:border-emerald-400';
                              if (checked && isCorrectOption) stateClasses = 'border-emerald-500 bg-emerald-50';
                              else if (checked && isSelected && !isCorrectOption) stateClasses = 'border-red-400 bg-red-50';
                              else if (isSelected) stateClasses = 'border-emerald-400 bg-emerald-50/50';
                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => selectQuizAnswer(key, optIndex)}
                                  disabled={checked}
                                  className={`w-full text-left p-3.5 rounded-lg border-2 transition flex items-center justify-between gap-3 ${stateClasses} ${checked ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                  <span className="text-sm font-medium text-gray-800">{option}</span>
                                  {checked && isCorrectOption && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                                  {checked && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                                </button>
                              );
                            })}
                          </div>

                          {!checked ? (
                            <button
                              onClick={() => checkQuizAnswer(key)}
                              disabled={selected === undefined}
                              className="px-5 py-2 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Check answer
                            </button>
                          ) : (
                            <div className={`p-4 rounded-lg text-sm ${selected === q.correctAnswer ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
                              <p className="font-semibold mb-1">
                                {selected === q.correctAnswer ? 'Correct!' : 'Not quite — here\'s why:'}
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
                // assignment
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <PenSquare className="w-5 h-5 text-violet-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentContent.title}</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed my-4">{currentContent.instructions}</p>

                  <div className="bg-violet-50 border-l-4 border-violet-400 p-5 rounded-r-lg mb-6">
                    <h3 className="font-bold text-violet-900 mb-1 text-sm uppercase tracking-wide">Prompt</h3>
                    <p className="text-violet-800">{currentContent.prompt}</p>
                  </div>

                  {!assignmentSubmitted ? (
                    <>
                      <textarea
                        value={assignmentText}
                        onChange={(e) => setAssignmentText(e.target.value)}
                        placeholder={currentContent.placeholder ?? 'Start writing here...'}
                        rows={8}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition text-gray-800 leading-relaxed resize-y"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-sm font-medium ${wordCount >= minWords ? 'text-emerald-600' : 'text-gray-500'}`}>
                          {wordCount} / {minWords} words
                        </span>
                        <button
                          onClick={submitAssignment}
                          disabled={wordCount === 0}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          Submit Assignment
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-emerald-900 mb-1">Assignment submitted</h3>
                      <p className="text-emerald-700 text-sm mb-4">Nice work — your {wordCount}-word response has been recorded for this lesson.</p>
                      <button onClick={() => setAssignmentSubmitted(false)} className="text-emerald-700 font-semibold text-sm underline">
                        Edit my submission
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => currentSection > 0 && setCurrentSection(currentSection - 1)}
                  disabled={currentSection === 0}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {currentContent.type !== 'assignment' && (
                  <button
                    onClick={markComplete}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg flex items-center gap-2"
                  >
                    {currentSection === sections.length - 1 ? 'Complete Lesson' : 'Mark Complete & Continue'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                {currentContent.type === 'assignment' && assignmentSubmitted && currentSection < sections.length - 1 && (
                  <button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg flex items-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lesson Content</h3>
              <div className="space-y-2">
                {sections.map((section, index) => {
                  const Icon = sectionIcon(section.type);
                  return (
                    <div
                      key={section.id}
                      onClick={() => setCurrentSection(index)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        currentSection === index
                          ? 'bg-emerald-50 border-2 border-emerald-500'
                          : 'border-2 border-gray-100 hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {completedSections.includes(index) ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm mb-1 ${currentSection === index ? 'text-emerald-700' : 'text-gray-900'}`}>
                            {section.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Icon className="w-3 h-3" />
                            <span>{section.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Resources
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}