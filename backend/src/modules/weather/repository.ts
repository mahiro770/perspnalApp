import { and, eq } from 'drizzle-orm';
import type { Db } from '../../db';
import { weatherCache, weatherLocations } from '../../db/schema';

export async function getCache(db: Db, areaCode: string, kind = 'forecast') {
  const rows = await db
    .select()
    .from(weatherCache)
    .where(and(eq(weatherCache.areaCode, areaCode), eq(weatherCache.kind, kind)))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertCache(
  db: Db,
  areaCode: string,
  kind: string,
  rawPayload: string,
  fetchedAt: Date,
  expiresAt: Date,
) {
  const existing = await getCache(db, areaCode, kind);

  if (existing) {
    const [row] = await db
      .update(weatherCache)
      .set({ rawPayload, fetchedAt, expiresAt })
      .where(eq(weatherCache.id, existing.id))
      .returning();
    return row;
  }

  const [row] = await db
    .insert(weatherCache)
    .values({ areaCode, kind, rawPayload, fetchedAt, expiresAt })
    .returning();
  return row;
}

export async function getPrimaryLocation(db: Db, userId: string) {
  const rows = await db
    .select()
    .from(weatherLocations)
    .where(and(eq(weatherLocations.userId, userId), eq(weatherLocations.isPrimary, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function listAllLocations(db: Db) {
  return db.select().from(weatherLocations);
}

export async function listLocationsForUser(db: Db, userId: string) {
  return db
    .select()
    .from(weatherLocations)
    .where(eq(weatherLocations.userId, userId))
    .orderBy(weatherLocations.sortOrder, weatherLocations.createdAt);
}

export async function addLocation(db: Db, userId: string, areaCode: string, areaName: string) {
  const existing = await db
    .select()
    .from(weatherLocations)
    .where(and(eq(weatherLocations.userId, userId), eq(weatherLocations.areaCode, areaCode)))
    .limit(1);
  if (existing[0]) return existing[0];

  const userLocations = await db.select().from(weatherLocations).where(eq(weatherLocations.userId, userId));

  // 最初の1件は自動的にデフォルト地域にする(未設定のまま予報が見られない状態を避ける)
  const [row] = await db
    .insert(weatherLocations)
    .values({ userId, areaCode, areaName, isPrimary: userLocations.length === 0 })
    .returning();
  return row;
}

export async function removeLocation(db: Db, userId: string, id: string) {
  const [row] = await db
    .delete(weatherLocations)
    .where(and(eq(weatherLocations.id, id), eq(weatherLocations.userId, userId)))
    .returning();
  return row ?? null;
}

export async function setPrimaryLocation(db: Db, userId: string, areaCode: string, areaName: string) {
  const existing = await db
    .select()
    .from(weatherLocations)
    .where(and(eq(weatherLocations.userId, userId), eq(weatherLocations.areaCode, areaCode)))
    .limit(1);

  await db.update(weatherLocations).set({ isPrimary: false }).where(eq(weatherLocations.userId, userId));

  if (existing[0]) {
    const [row] = await db
      .update(weatherLocations)
      .set({ isPrimary: true })
      .where(eq(weatherLocations.id, existing[0].id))
      .returning();
    return row;
  }

  const [row] = await db
    .insert(weatherLocations)
    .values({ userId, areaCode, areaName, isPrimary: true })
    .returning();
  return row;
}
