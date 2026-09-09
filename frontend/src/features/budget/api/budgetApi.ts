import { api } from '@/lib/api';
import { BudgetSummary, Category, Goal, NewTransactionInput, Transaction, TransactionType } from './types';
import {
  MOCK_CATEGORIES,
  buildMockSummary,
  mockCreateCategory,
  mockCreateTransaction,
  mockDeleteTransaction,
  mockGetGoal,
  mockListTransactions,
  mockSetGoal,
  mockUpdateCategoryLimit,
  mockUpdateTransaction,
} from './mockData';

interface TransactionQuery {
  from?: string;
  to?: string;
  type?: TransactionType;
}

export async function fetchTransactions(query: TransactionQuery = {}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.type) params.set('type', query.type);

  try {
    return await api.get<Transaction[]>(`/api/budget/transactions?${params.toString()}`);
  } catch {
    return mockListTransactions(query.from, query.to, query.type);
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    return await api.get<Category[]>('/api/budget/categories');
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function fetchBudgetSummary(month: string): Promise<BudgetSummary> {
  try {
    return await api.get<BudgetSummary>(`/api/budget/summary?month=${month}`);
  } catch {
    return buildMockSummary(month);
  }
}

export async function createTransaction(input: NewTransactionInput): Promise<Transaction> {
  try {
    return await api.post<Transaction>('/api/budget/transactions', input);
  } catch {
    return mockCreateTransaction(input);
  }
}

export async function updateTransaction(id: string, input: NewTransactionInput): Promise<Transaction> {
  try {
    return await api.put<Transaction>(`/api/budget/transactions/${id}`, input);
  } catch {
    return mockUpdateTransaction(id, input);
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    await api.delete<void>(`/api/budget/transactions/${id}`);
  } catch {
    mockDeleteTransaction(id);
  }
}

export async function createCategory(input: Omit<Category, 'id' | 'monthlyLimit'>): Promise<Category> {
  try {
    return await api.post<Category>('/api/budget/categories', input);
  } catch {
    return mockCreateCategory(input);
  }
}

export async function updateCategoryLimit(id: string, monthlyLimit: number | null): Promise<Category> {
  try {
    return await api.put<Category>(`/api/budget/categories/${id}`, { monthlyLimit });
  } catch {
    return mockUpdateCategoryLimit(id, monthlyLimit);
  }
}

export async function fetchGoal(month: string): Promise<Goal> {
  try {
    return await api.get<Goal>(`/api/budget/goal?month=${month}`);
  } catch {
    return mockGetGoal(month);
  }
}

export async function setGoal(month: string, targetAmount: number): Promise<Goal> {
  try {
    return await api.put<Goal>('/api/budget/goal', { month, targetAmount });
  } catch {
    return mockSetGoal(month, targetAmount);
  }
}
