import { and, asc, eq, gte, isNull, lte } from 'drizzle-orm';
import type { Db } from '../../db';
import { calendarEvents } from '../../db/schema';

export interface CalendarEventInput {
  title: string;
  description?: string | null;
  location?: string | null;
  startAt: Date;
  endAt?: Date | null;
  allDay?: boolean;
  recurrenceRule?: string | null;
  category?: string | null;
  reminderMinutesBefore?: number | null;
}

export async function listEvents(db: Db, userId: string, from: Date, to: Date) {
  return db
    .select()
    .from(calendarEvents)
    .where(
      and(
        eq(calendarEvents.userId, userId),
        isNull(calendarEvents.deletedAt),
        gte(calendarEvents.startAt, from),
        lte(calendarEvents.startAt, to),
      ),
    )
    .orderBy(asc(calendarEvents.startAt));
}

export async function createEvent(db: Db, userId: string, input: CalendarEventInput) {
  const [row] = await db
    .insert(calendarEvents)
    .values({ userId, ...input })
    .returning();
  return row;
}

export async function updateEvent(db: Db, userId: string, id: string, input: CalendarEventInput) {
  const [row] = await db
    .update(calendarEvents)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId), isNull(calendarEvents.deletedAt)))
    .returning();
  return row ?? null;
}

export async function softDeleteEvent(db: Db, userId: string, id: string) {
  const [row] = await db
    .update(calendarEvents)
    .set({ deletedAt: new Date() })
    .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId), isNull(calendarEvents.deletedAt)))
    .returning();
  return row ?? null;
}
