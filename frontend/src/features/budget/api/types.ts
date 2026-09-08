export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  memo?: string;
}

export interface NewTransactionInput {
  date: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  memo?: string;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  type: TransactionType;
  amount: number;
}

export interface BudgetSummary {
  month: string;
  totalIncome: number;
  totalExpense: number;
  byCategory: CategorySummary[];
}
