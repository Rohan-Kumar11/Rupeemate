export interface FinancialGoal {
  id: string;
  user_id?: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  priority: "High" | "Medium" | "Low";
  category: string;
  status: "active" | "completed" | "paused";
}

export interface TaxRecord {
  id: string;
  user_id?: string;
  income_source: string;
  income_amount: number;
  date: string;
  category: string;
  platform?: string;
  document_status: "available" | "missing" | "not_applicable";
  notes?: string;
}

export interface TaxChecklist {
  incomeRecordsAvailable: boolean;
  platformStatementsAvailable: boolean;
  bankRecordsOrganized: boolean;
  documentsCollected: boolean;
  expenseRecordsOrganized: boolean;
}

export interface PlanningSummary {
  goals: FinancialGoal[];
  priorityGoal: FinancialGoal | null;
  goalProgress: number;
  taxStatus: {
    totalIncome: number;
    recordCount: number;
    missingDocuments: number;
    needsAttention: boolean;
  };
  taxReminders: string[];
  missingDocuments: string[];
}