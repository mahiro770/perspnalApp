import { and, eq } from 'drizzle-orm';
import type { Db } from '../../db';
import { pushSubscriptions } from '../../db/schema';

export async function listActiveSubscriptions(db: Db) {
  return db.select().from(pushSubscriptions).where(eq(pushSubscriptions.isActive, true));
}

export async function findByEndpoint(db: Db, userId: string, endpoint: string) {
  const rows = await db
    .select()
    .from(pushSubscriptions)
    .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)))
    .limit(1);
  return rows[0] ?? null;
}

export interface SubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string | null;
}

export async function createSubscription(db: Db, userId: string, input: SubscriptionInput) {
  const [row] = await db
    .insert(pushSubscriptions)
    .values({ userId, ...input })
    .returning();
  return row;
}

export async function reactivateSubscription(
  db: Db,
  id: string,
  input: Pick<SubscriptionInput, 'p256dh' | 'auth' | 'userAgent'>,
) {
  const [row] = await db
    .update(pushSubscriptions)
    .set({ ...input, isActive: true })
    .where(eq(pushSubscriptions.id, id))
    .returning();
  return row;
}

export async function deactivateById(db: Db, id: string) {
  const [row] = await db
    .update(pushSubscriptions)
    .set({ isActive: false })
    .where(eq(pushSubscriptions.id, id))
    .returning();
  return row ?? null;
}

export async function markUsed(db: Db, id: string) {
  await db.update(pushSubscriptions).set({ lastUsedAt: new Date() }).where(eq(pushSubscriptions.id, id));
}
