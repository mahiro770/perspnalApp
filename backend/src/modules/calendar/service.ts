import { NotFoundError, ValidationError } from '../../core/errors';
import type { Db } from '../../db';
import * as repo from './repository';
import type { CalendarEventInput } from './repository';

const JST_OFFSET_MS = 9 * 60 * 60 * 1000; // 日本にDSTはないため固定オフセットで十分
const NAIVE_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

function todayRangeJst(): { from: Date; to: Date } {
  const jstNow = new Date(Date.now() + JST_OFFSET_MS);
  const y = jstNow.getUTCFullYear();
  const m = jstNow.getUTCMonth();
  const d = jstNow.getUTCDate();
  const fromJstMs = Date.UTC(y, m, d, 0, 0, 0, 0);
  const toJstMs = Date.UTC(y, m, d, 23, 59, 59, 999);
  return { from: new Date(fromJstMs - JST_OFFSET_MS), to: new Date(toJstMs - JST_OFFSET_MS) };
}

// フロントエンドはタイムゾーンオフセットなしのローカル(JST)時刻文字列を送ってくる
// (例: "2026-09-08T10:00:00")。WorkersランタイムはUTCで動くため、これを素の
// `new Date()` に渡すとUTC時刻として解釈され9時間ズレる。オフセット表記が
// 無い文字列はJSTの壁時計時刻とみなして変換する。
function parseClientDate(value: string): Date {
  if (NAIVE_DATETIME_RE.test(value)) {
    const [datePart, timePart] = value.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    const [h, mi, s = 0] = timePart.split(':').map(Number);
    return new Date(Date.UTC(y, m - 1, d, h, mi, s) - JST_OFFSET_MS);
  }
  return new Date(value);
}

function parseDateParam(value: string | undefined, fieldName: string): Date {
  if (!value) throw new ValidationError(`${fieldName} is required`);
  const date = parseClientDate(value);
  if (Number.isNaN(date.getTime())) throw new ValidationError(`${fieldName} is invalid`);
  return date;
}

function validateInput(body: any): CalendarEventInput {
  if (!body || typeof body.title !== 'string' || body.title.trim() === '') {
    throw new ValidationError('title is required');
  }
  if (!body.startAt) throw new ValidationError('startAt is required');

  const startAt = parseClientDate(body.startAt);
  if (Number.isNaN(startAt.getTime())) throw new ValidationError('startAt is invalid');

  let endAt: Date | null = null;
  if (body.endAt) {
    endAt = parseClientDate(body.endAt);
    if (Number.isNaN(endAt.getTime())) throw new ValidationError('endAt is invalid');
    if (endAt < startAt) throw new ValidationError('endAt must not be before startAt');
  }

  return {
    title: body.title.trim(),
    // フロントエンドの公開フィールド名は "memo"(家計簿と揃えている)。DB列名は description のまま。
    description: body.memo ?? body.description ?? null,
    location: body.location ?? null,
    startAt,
    endAt,
    allDay: Boolean(body.allDay),
    recurrenceRule: body.recurrenceRule ?? null,
    category: body.category ?? null,
    reminderMinutesBefore: typeof body.reminderMinutesBefore === 'number' ? body.reminderMinutesBefore : null,
  };
}

export async function listEvents(db: Db, userId: string, fromRaw?: string, toRaw?: string) {
  const from = parseDateParam(fromRaw, 'from');
  const to = parseDateParam(toRaw, 'to');
  return repo.listEvents(db, userId, from, to);
}

export async function listToday(db: Db, userId: string) {
  const { from, to } = todayRangeJst();
  return repo.listEvents(db, userId, from, to);
}

export async function createEvent(db: Db, userId: string, body: any) {
  const input = validateInput(body);
  return repo.createEvent(db, userId, input);
}

export async function updateEvent(db: Db, userId: string, id: string, body: any) {
  const input = validateInput(body);
  const updated = await repo.updateEvent(db, userId, id, input);
  if (!updated) throw new NotFoundError('event not found');
  return updated;
}

export async function deleteEvent(db: Db, userId: string, id: string) {
  const deleted = await repo.softDeleteEvent(db, userId, id);
  if (!deleted) throw new NotFoundError('event not found');
  return deleted;
}
