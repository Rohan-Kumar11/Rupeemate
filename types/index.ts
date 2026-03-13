// src/types/index.ts

export interface Expense {
  category: string;
  amount: number;
}

export interface BudgetData {
  id: number;
  income: number;
  total_expenses: number;
  remaining: number;
  expenses: Expense[];
  created_at?: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}