import { getMonthGridDays, isSameDay, toDateKey, formatCurrency } from '@/lib/date';
import { CalendarEvent } from '../api/types';
import { Transaction } from '@/features/budget/api/types';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MAX_EVENT_CHIPS = 2;

interface DailyTotal {
  income: number;
  expense: number;
}

interface MonthGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  transactions: Transaction[];
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function MonthGrid({
  year,
  month,
  events,
  transactions,
  selectedDate,
  onSelectDate,
  onSelectEvent,
}: MonthGridProps) {
  const days = getMonthGridDays(year, month);
  const today = new Date();

  const eventsByDate = new Map<string, CalendarEvent[]>();
  events.forEach((e) => {
    const key = e.startAt.slice(0, 10);
    eventsByDate.set(key, [...(eventsByDate.get(key) ?? []), e]);
  });

  const totalsByDate = new Map<string, DailyTotal>();
  transactions.forEach((tx) => {
    const totals = totalsByDate.get(tx.date) ?? { income: 0, expense: 0 };
    if (tx.type === 'income') totals.income += tx.amount;
    else totals.expense += tx.amount;
    totalsByDate.set(tx.date, totals);
  });

  return (
    <div className="rounded-xl border border-border-strong bg-surface p-2">
      <div className="grid grid-cols-7 text-center text-xs text-text-muted">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`py-1 ${i === 0 ? 'text-expense' : i === 6 ? 'text-weather' : ''}`}>
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-border-strong">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const inMonth = day.getMonth() === month;
          const isToday = isSameDay(day, today);
          const isSelected = dateKey === selectedDate;
          const dayEvents = eventsByDate.get(dateKey) ?? [];
          const dayTotals = totalsByDate.get(dateKey);

          const shownEvents = dayEvents.slice(0, MAX_EVENT_CHIPS);
          const hiddenCount = dayEvents.length - shownEvents.length;

          return (
            <div
              key={dateKey}
              className={`flex min-h-[68px] flex-col gap-0.5 bg-surface p-1 sm:min-h-[84px] ${
                isSelected ? 'ring-2 ring-inset ring-calendar' : ''
              } ${!inMonth ? 'bg-surface-alt/50' : ''}`}
            >
              <button
                onClick={() => onSelectDate(dateKey)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center self-start rounded-full text-xs ${
                  isToday
                    ? 'bg-calendar font-semibold text-white'
                    : inMonth
                      ? 'text-text hover:bg-surface-alt'
                      : 'text-text-muted/40'
                }`}
              >
                {day.getDate()}
              </button>

              <div className="flex flex-col gap-0.5 overflow-hidden">
                {shownEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => onSelectEvent(ev)}
                    title={ev.title}
                    className="truncate rounded bg-calendar/15 px-1 py-0.5 text-left text-[10px] font-medium leading-tight text-calendar hover:bg-calendar/25 sm:text-[11px]"
                  >
                    {ev.title}
                  </button>
                ))}
                {dayTotals && dayTotals.income > 0 && (
                  <button
                    onClick={() => onSelectDate(dateKey)}
                    title={`収入合計 ${formatCurrency(dayTotals.income)}(内訳を見る)`}
                    className="truncate rounded bg-income/15 px-1 py-0.5 text-left text-[10px] font-semibold leading-tight text-income hover:bg-income/25 sm:text-[11px]"
                  >
                    +{formatCurrency(dayTotals.income)}
                  </button>
                )}
                {dayTotals && dayTotals.expense > 0 && (
                  <button
                    onClick={() => onSelectDate(dateKey)}
                    title={`支出合計 ${formatCurrency(dayTotals.expense)}(内訳を見る)`}
                    className="truncate rounded bg-expense/15 px-1 py-0.5 text-left text-[10px] font-semibold leading-tight text-expense hover:bg-expense/25 sm:text-[11px]"
                  >
                    -{formatCurrency(dayTotals.expense)}
                  </button>
                )}
                {hiddenCount > 0 && (
                  <button
                    onClick={() => onSelectDate(dateKey)}
                    className="truncate rounded px-1 py-0.5 text-left text-[10px] text-text-muted hover:bg-surface-alt sm:text-[11px]"
                  >
                    +{hiddenCount}件
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
