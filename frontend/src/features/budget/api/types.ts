export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  /** 月の上限額。nullは未設定 */
  monthlyLimit: number | null;
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

export interface Goal {
  /** YYYY-MM */
  month: string;
  /** 0 は未設定を表す */
  targetAmount: number;
}
