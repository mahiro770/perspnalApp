import { toDateKey, toLocalIsoString } from '@/lib/date';
import { CalendarEvent, NewEventInput } from './types';

function atDay(dayOffset: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// ローカル時刻のまま保持する(toISOString()はUTC変換されズレるため使わない)
function iso(dayOffset: number, hour: number, minute = 0): string {
  return toLocalIsoString(atDay(dayOffset, hour, minute));
}

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'プロジェクト定例ミーティング',
    startAt: iso(0, 10, 0),
    endAt: iso(0, 11, 0),
    allDay: false,
    location: 'オンライン(Meet)',
  },
  {
    id: 'ev-2',
    title: '歯科検診',
    startAt: iso(0, 18, 30),
    endAt: iso(0, 19, 0),
    allDay: false,
    location: 'さくら歯科クリニック',
  },
  {
    id: 'ev-3',
    title: '友人と食事',
    startAt: iso(1, 19, 0),
    endAt: iso(1, 21, 0),
    allDay: false,
    location: '渋谷',
    memo: '駅前の焼き鳥屋',
  },
  {
    id: 'ev-4',
    title: '住民税 第2期納付期限',
    startAt: iso(4, 0, 0),
    endAt: iso(4, 23, 59),
    allDay: true,
  },
  {
    id: 'ev-5',
    title: '実家に帰省',
    startAt: iso(9, 9, 0),
    endAt: iso(11, 18, 0),
    allDay: true,
    memo: '新幹線 9:20発',
  },
  {
    id: 'ev-6',
    title: '健康診断',
    startAt: iso(-3, 9, 30),
    endAt: iso(-3, 11, 0),
    allDay: false,
    location: '市民健康センター',
  },
  {
    id: 'ev-7',
    title: 'ジム',
    startAt: iso(2, 20, 0),
    endAt: iso(2, 21, 30),
    allDay: false,
  },
  {
    id: 'ev-8',
    title: '確定申告 準備',
    startAt: iso(14, 0, 0),
    endAt: iso(14, 23, 59),
    allDay: true,
  },
];

let nextId = MOCK_EVENTS.length + 1;

export function mockListEvents(from?: string, to?: string): CalendarEvent[] {
  return MOCK_EVENTS.filter((e) => {
    const dateKey = e.startAt.slice(0, 10);
    if (from && dateKey < from) return false;
    if (to && dateKey > to) return false;
    return true;
  }).sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function mockTodayEvents(): CalendarEvent[] {
  const todayKey = toDateKey(new Date());
  return mockListEvents(todayKey, todayKey);
}

export function mockCreateEvent(input: NewEventInput): CalendarEvent {
  const event: CalendarEvent = { id: `ev-${nextId++}`, ...input };
  MOCK_EVENTS.push(event);
  return event;
}

export function mockUpdateEvent(id: string, input: NewEventInput): CalendarEvent {
  const index = MOCK_EVENTS.findIndex((e) => e.id === id);
  const updated: CalendarEvent = { id, ...input };
  if (index >= 0) MOCK_EVENTS[index] = updated;
  return updated;
}

export function mockDeleteEvent(id: string): void {
  const index = MOCK_EVENTS.findIndex((e) => e.id === id);
  if (index >= 0) MOCK_EVENTS.splice(index, 1);
}
