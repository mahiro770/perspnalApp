import { ValidationError } from '../../core/errors';
import type { Db } from '../../db';
import * as repo from './repository';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
type GroupBy = 'day' | 'month' | 'year';

function todayJst(): Date {
  const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
  return new Date(Date.now() + JST_OFFSET_MS);
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function recordSteps(db: Db, userId: string, body: any) {
  const date = body?.date;
  const steps = body?.steps;
  if (typeof date !== 'string' || !DATE_RE.test(date)) {
    throw new ValidationError('date must be in YYYY-MM-DD format');
  }
  if (typeof steps !== 'number' || !Number.isFinite(steps) || steps < 0) {
    throw new ValidationError('steps must be a non-negative number');
  }
  const source = typeof body?.source === 'string' ? body.source : 'shortcuts';
  const row = await repo.upsertSteps(db, userId, date, Math.round(steps), source);
  return { date: row.date, steps: row.steps };
}

function defaultRange(groupBy: GroupBy): { from: string; to: string } {
  const today = todayJst();
  const to = toDateKey(today);
  if (groupBy === 'day') {
    const from = new Date(today);
    from.setUTCDate(from.getUTCDate() - 13);
    return { from: toDateKey(from), to };
  }
  if (groupBy === 'month') {
    const from = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
    return { from: toDateKey(from), to };
  }
  const from = new Date(Date.UTC(today.getUTCFullYear() - 4, 0, 1));
  return { from: toDateKey(from), to };
}

export async function getSteps(db: Db, userId: string, groupByParam?: string, fromParam?: string, toParam?: string) {
  const groupBy: GroupBy = groupByParam === 'month' || groupByParam === 'year' ? groupByParam : 'day';
  const fallback = defaultRange(groupBy);
  const from = fromParam && DATE_RE.test(fromParam) ? fromParam : fallback.from;
  const to = toParam && DATE_RE.test(toParam) ? toParam : fallback.to;

  const rows = await repo.listSteps(db, userId, from, to);

  if (groupBy === 'day') {
    return rows.map((r) => ({ label: r.date, steps: r.steps }));
  }

  const sliceLength = groupBy === 'month' ? 7 : 4;
  const totals = new Map<string, number>();
  for (const r of rows) {
    const label = r.date.slice(0, sliceLength);
    totals.set(label, (totals.get(label) ?? 0) + r.steps);
  }
  return Array.from(totals.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([label, steps]) => ({ label, steps }));
}
