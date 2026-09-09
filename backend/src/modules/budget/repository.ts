import { and, asc, desc, eq, gte, isNull, lte, type SQL } from 'drizzle-orm';
import type { Db } from '../../db';
import { budgetCategories, budgetGoals, budgetTransactions } from '../../db/schema';

export interface TransactionInput {
  categoryId: string;
  calendarEventId?: string | null;
  type: 'income' | 'expense';
  amountMinor: number;
  currency?: string;
  transactionDate: string;
  paymentMethod?: string | null;
  memo?: string | null;
}

export interface CategoryInput {
  name: string;
  type: 'income' | 'expense';
  color?: string | null;
  icon?: string | null;
  sortOrder?: number;
}

export async function listTransactions(
  db: Db,
  userId: string,
  from?: string,
  to?: string,
  type?: 'income' | 'expense',
) {
  const conditions: SQL[] = [eq(budgetTransactions.userId, userId), isNull(budgetTransactions.deletedAt)];
  if (from) conditions.push(gte(budgetTransactions.transactionDate, from));
  if (to) conditions.push(lte(budgetTransactions.transactionDate, to));
  if (type) conditions.push(eq(budgetTransactions.type, type));

  return db
    .select()
    .from(budgetTransactions)
    .where(and(...conditions))
    .orderBy(desc(budgetTransactions.transactionDate));
}

export async function listTransactionsForMonth(db: Db, userId: string, monthPrefix: string) {
  return db
    .select()
    .from(budgetTransactions)
    .where(
      and(
        eq(budgetTransactions.userId, userId),
        isNull(budgetTransactions.deletedAt),
        gte(budgetTransactions.transactionDate, `${monthPrefix}-01`),
        lte(budgetTransactions.transactionDate, `${monthPrefix}-31`),
      ),
    );
}

export async function createTransaction(db: Db, userId: string, input: TransactionInput) {
  const [row] = await db
    .insert(budgetTransactions)
    .values({ userId, ...input })
    .returning();
  return row;
}

export async function updateTransaction(db: Db, userId: string, id: string, input: TransactionInput) {
  const [row] = await db
    .update(budgetTransactions)
    .set({ ...input, updatedAt: new Date() })
    .where(
      and(
        eq(budgetTransactions.id, id),
        eq(budgetTransactions.userId, userId),
        isNull(budgetTransactions.deletedAt),
      ),
    )
    .returning();
  return row ?? null;
}

export async function softDeleteTransaction(db: Db, userId: string, id: string) {
  const [row] = await db
    .update(budgetTransactions)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(budgetTransactions.id, id),
        eq(budgetTransactions.userId, userId),
        isNull(budgetTransactions.deletedAt),
      ),
    )
    .returning();
  return row ?? null;
}

export async function listCategories(db: Db, userId: string) {
  return db
    .select()
    .from(budgetCategories)
    .where(and(eq(budgetCategories.userId, userId), eq(budgetCategories.isArchived, false)))
    .orderBy(asc(budgetCategories.sortOrder));
}

export async function createCategory(db: Db, userId: string, input: CategoryInput) {
  const [row] = await db
    .insert(budgetCategories)
    .values({ userId, ...input })
    .returning();
  return row;
}

export async function getGoal(db: Db, userId: string, month: string) {
  const [row] = await db
    .select()
    .from(budgetGoals)
    .where(and(eq(budgetGoals.userId, userId), eq(budgetGoals.month, month)))
    .limit(1);
  return row ?? null;
}

export async function upsertGoal(db: Db, userId: string, month: string, targetAmountMinor: number) {
  const existing = await getGoal(db, userId, month);
  if (existing) {
    const [row] = await db
      .update(budgetGoals)
      .set({ targetAmountMinor, updatedAt: new Date() })
      .where(eq(budgetGoals.id, existing.id))
      .returning();
    return row;
  }
  const [row] = await db.insert(budgetGoals).values({ userId, month, targetAmountMinor }).returning();
  return row;
}
