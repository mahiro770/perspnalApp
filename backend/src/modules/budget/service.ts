import { NotFoundError, ValidationError } from '../../core/errors';
import type { Db } from '../../db';
import * as repo from './repository';
import type { CategoryInput, TransactionInput } from './repository';

// 公開API上のフィールド名は amount / date(フロントエンドの命名)。
// DB/内部層は amountMinor / transactionDate(design docの命名)のままなので、この境界で変換する。
function validateTransactionInput(body: any): TransactionInput {
  const amount = body?.amount ?? body?.amountMinor;
  const date = body?.date ?? body?.transactionDate;

  if (!body || typeof body.categoryId !== 'string' || body.categoryId === '') {
    throw new ValidationError('categoryId is required');
  }
  if (body.type !== 'income' && body.type !== 'expense') {
    throw new ValidationError('type must be "income" or "expense"');
  }
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    throw new ValidationError('amount must be a non-negative number');
  }
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ValidationError('date must be in YYYY-MM-DD format');
  }

  return {
    categoryId: body.categoryId,
    calendarEventId: body.calendarEventId ?? null,
    type: body.type,
    amountMinor: amount,
    currency: typeof body.currency === 'string' ? body.currency : 'JPY',
    transactionDate: date,
    paymentMethod: body.paymentMethod ?? null,
    memo: body.memo ?? null,
  };
}

function validateCategoryInput(body: any): CategoryInput {
  if (!body || typeof body.name !== 'string' || body.name.trim() === '') {
    throw new ValidationError('name is required');
  }
  if (body.type !== 'income' && body.type !== 'expense') {
    throw new ValidationError('type must be "income" or "expense"');
  }

  return {
    name: body.name.trim(),
    type: body.type,
    color: body.color ?? null,
    icon: body.icon ?? null,
    sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
  };
}

export async function listTransactions(db: Db, userId: string, from?: string, to?: string, type?: string) {
  const normalizedType = type === 'income' || type === 'expense' ? type : undefined;
  return repo.listTransactions(db, userId, from, to, normalizedType);
}

export async function createTransaction(db: Db, userId: string, body: any) {
  const input = validateTransactionInput(body);
  return repo.createTransaction(db, userId, input);
}

export async function updateTransaction(db: Db, userId: string, id: string, body: any) {
  const input = validateTransactionInput(body);
  const updated = await repo.updateTransaction(db, userId, id, input);
  if (!updated) throw new NotFoundError('transaction not found');
  return updated;
}

export async function deleteTransaction(db: Db, userId: string, id: string) {
  const deleted = await repo.softDeleteTransaction(db, userId, id);
  if (!deleted) throw new NotFoundError('transaction not found');
  return deleted;
}

export async function listCategories(db: Db, userId: string) {
  return repo.listCategories(db, userId);
}

export async function createCategory(db: Db, userId: string, body: any) {
  const input = validateCategoryInput(body);
  return repo.createCategory(db, userId, input);
}

export async function getMonthlySummary(db: Db, userId: string, month?: string) {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    throw new ValidationError('month must be in YYYY-MM format');
  }

  const [transactions, categories] = await Promise.all([
    repo.listTransactionsForMonth(db, userId, month),
    repo.listCategories(db, userId),
  ]);
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

  let totalIncome = 0;
  let totalExpense = 0;
  const byCategory = new Map<string, { categoryId: string; categoryName: string; type: string; amount: number }>();

  for (const tx of transactions) {
    if (tx.type === 'income') totalIncome += tx.amountMinor;
    else totalExpense += tx.amountMinor;

    const existing = byCategory.get(tx.categoryId);
    if (existing) {
      existing.amount += tx.amountMinor;
    } else {
      byCategory.set(tx.categoryId, {
        categoryId: tx.categoryId,
        categoryName: categoryNameById.get(tx.categoryId) ?? '不明なカテゴリ',
        type: tx.type,
        amount: tx.amountMinor,
      });
    }
  }

  return {
    month,
    totalIncome,
    totalExpense,
    byCategory: Array.from(byCategory.values()),
  };
}
