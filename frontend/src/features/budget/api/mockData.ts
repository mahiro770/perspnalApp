import { toDateKey, toMonthKey } from '@/lib/date';
import { BudgetSummary, Category, Goal, NewTransactionInput, Transaction } from './types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-salary', name: '給与', type: 'income', color: '#2563eb', monthlyLimit: null },
  { id: 'cat-side', name: '副業', type: 'income', color: '#0891b2', monthlyLimit: null },
  { id: 'cat-other-income', name: 'その他収入', type: 'income', color: '#0d9488', monthlyLimit: null },
  { id: 'cat-food', name: '食費', type: 'expense', color: '#f97316', monthlyLimit: 30000 },
  { id: 'cat-daily', name: '日用品', type: 'expense', color: '#a855f7', monthlyLimit: null },
  { id: 'cat-transport', name: '交通費', type: 'expense', color: '#eab308', monthlyLimit: null },
  { id: 'cat-utility', name: '水道光熱費', type: 'expense', color: '#ef4444', monthlyLimit: null },
  { id: 'cat-housing', name: '住居費', type: 'expense', color: '#64748b', monthlyLimit: null },
  { id: 'cat-entertainment', name: '娯楽', type: 'expense', color: '#ec4899', monthlyLimit: 5000 },
  { id: 'cat-medical', name: '医療費', type: 'expense', color: '#14b8a6', monthlyLimit: null },
];

function dateInCurrentMonth(day: number): string {
  const now = new Date();
  return toDateKey(new Date(now.getFullYear(), now.getMonth(), day));
}

function dateInPreviousMonth(day: number): string {
  const now = new Date();
  return toDateKey(new Date(now.getFullYear(), now.getMonth() - 1, day));
}

// アプリ内で作成・編集・削除できるよう、実際に変更されるモックの内部状態として保持する
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', date: dateInCurrentMonth(1), type: 'expense', categoryId: 'cat-housing', amount: 78000, memo: '家賃' },
  { id: 'tx-2', date: dateInCurrentMonth(3), type: 'expense', categoryId: 'cat-food', amount: 3480, memo: 'スーパー' },
  { id: 'tx-3', date: dateInCurrentMonth(4), type: 'expense', categoryId: 'cat-daily', amount: 1580, memo: 'ドラッグストア' },
  { id: 'tx-4', date: dateInCurrentMonth(5), type: 'expense', categoryId: 'cat-transport', amount: 620, memo: '定期区間外乗車' },
  { id: 'tx-5', date: dateInCurrentMonth(6), type: 'expense', categoryId: 'cat-food', amount: 2150, memo: '外食' },
  { id: 'tx-6', date: dateInCurrentMonth(7), type: 'expense', categoryId: 'cat-utility', amount: 8900, memo: '電気代' },
  { id: 'tx-7', date: dateInCurrentMonth(8), type: 'expense', categoryId: 'cat-entertainment', amount: 1500, memo: '動画配信サブスク' },
  { id: 'tx-8', date: dateInCurrentMonth(2), type: 'income', categoryId: 'cat-side', amount: 15000, memo: '副業報酬' },
  { id: 'tx-9', date: dateInCurrentMonth(8), type: 'expense', categoryId: 'cat-food', amount: 980, memo: 'コンビニ' },
  { id: 'tx-10', date: dateInCurrentMonth(1), type: 'income', categoryId: 'cat-salary', amount: 320000, memo: '給与振込' },
  { id: 'tx-11', date: dateInPreviousMonth(28), type: 'expense', categoryId: 'cat-medical', amount: 3200, memo: '内科受診' },
  { id: 'tx-12', date: dateInPreviousMonth(25), type: 'income', categoryId: 'cat-salary', amount: 318000, memo: '給与振込' },
];

let nextId = MOCK_TRANSACTIONS.length + 1;

export function mockCreateTransaction(input: NewTransactionInput): Transaction {
  const tx: Transaction = { id: `tx-${nextId++}`, ...input };
  MOCK_TRANSACTIONS.unshift(tx);
  return tx;
}

export function mockUpdateTransaction(id: string, input: NewTransactionInput): Transaction {
  const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
  const updated: Transaction = { id, ...input };
  if (index >= 0) MOCK_TRANSACTIONS[index] = updated;
  return updated;
}

export function mockDeleteTransaction(id: string): void {
  const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
  if (index >= 0) MOCK_TRANSACTIONS.splice(index, 1);
}

export function mockListTransactions(from?: string, to?: string, type?: 'income' | 'expense'): Transaction[] {
  return MOCK_TRANSACTIONS.filter((t) => {
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    if (type && t.type !== type) return false;
    return true;
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function mockCreateCategory(input: Omit<Category, 'id' | 'monthlyLimit'>): Category {
  const palette = ['#2563eb', '#f97316', '#a855f7', '#0d9488', '#ef4444', '#eab308', '#ec4899', '#64748b'];
  const category: Category = {
    id: `cat-${Date.now()}`,
    ...input,
    color: input.color || palette[MOCK_CATEGORIES.length % palette.length],
    monthlyLimit: null,
  };
  MOCK_CATEGORIES.push(category);
  return category;
}

export function mockUpdateCategoryLimit(id: string, monthlyLimit: number | null): Category {
  const category = MOCK_CATEGORIES.find((c) => c.id === id);
  if (!category) throw new Error('category not found');
  category.monthlyLimit = monthlyLimit;
  return category;
}

export function buildMockSummary(month: string): BudgetSummary {
  const { from, to } = (() => {
    const [y, m] = month.split('-').map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    return { from: toDateKey(start), to: toDateKey(end) };
  })();

  const txs = MOCK_TRANSACTIONS.filter((t) => t.date >= from && t.date <= to);
  const totalIncome = txs.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = txs.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const byCategoryMap = new Map<string, number>();
  txs.forEach((t) => byCategoryMap.set(t.categoryId, (byCategoryMap.get(t.categoryId) ?? 0) + t.amount));

  const byCategory = Array.from(byCategoryMap.entries()).map(([categoryId, amount]) => {
    const category = MOCK_CATEGORIES.find((c) => c.id === categoryId);
    return {
      categoryId,
      categoryName: category?.name ?? '不明',
      type: category?.type ?? 'expense',
      amount,
    };
  });

  return { month, totalIncome, totalExpense, byCategory };
}

export function currentMonthKey(): string {
  return toMonthKey(new Date());
}

const MOCK_GOALS = new Map<string, number>();

export function mockGetGoal(month: string): Goal {
  return { month, targetAmount: MOCK_GOALS.get(month) ?? 0 };
}

export function mockSetGoal(month: string, targetAmount: number): Goal {
  MOCK_GOALS.set(month, targetAmount);
  return { month, targetAmount };
}
