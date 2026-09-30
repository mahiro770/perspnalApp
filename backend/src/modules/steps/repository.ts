import { and, eq, gte, lte } from 'drizzle-orm';
import type { Db } from '../../db';
import { healthSteps } from '../../db/schema';

export async function upsertSteps(db: Db, userId: string, date: string, steps: number, source: string) {
  const existing = await db
    .select()
    .from(healthSteps)
    .where(and(eq(healthSteps.userId, userId), eq(healthSteps.date, date)))
    .limit(1);

  if (existing[0]) {
    const [row] = await db
      .update(healthSteps)
      .set({ steps, source, updatedAt: new Date() })
      .where(eq(healthSteps.id, existing[0].id))
      .returning();
    return row;
  }

  const [row] = await db.insert(healthSteps).values({ userId, date, steps, source }).returning();
  return row;
}

export async function listSteps(db: Db, userId: string, from: string, to: string) {
  return db
    .select()
    .from(healthSteps)
    .where(and(eq(healthSteps.userId, userId), gte(healthSteps.date, from), lte(healthSteps.date, to)))
    .orderBy(healthSteps.date);
}
