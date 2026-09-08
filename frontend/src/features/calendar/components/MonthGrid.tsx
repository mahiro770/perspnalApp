import { getMonthGridDays, isSameDay, toDateKey } from '@/lib/date';
import { CalendarEvent } from '../api/types';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

interface MonthGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
}

export function MonthGrid({ year, month, events, selectedDate, onSelectDate }: MonthGridProps) {
  const days = getMonthGridDays(year, month);
  const today = new Date();

  const eventCountByDate = new Map<string, number>();
  events.forEach((e) => {
    const key = e.startAt.slice(0, 10);
    eventCountByDate.set(key, (eventCountByDate.get(key) ?? 0) + 1);
  });

  return (
    <div className="rounded-xl border border-border bg-surface p-2">
      <div className="grid grid-cols-7 text-center text-xs text-text-muted">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`py-1 ${i === 0 ? 'text-expense' : i === 6 ? 'text-weather' : ''}`}>
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const inMonth = day.getMonth() === month;
          const isToday = isSameDay(day, today);
          const isSelected = dateKey === selectedDate;
          const count = eventCountByDate.get(dateKey) ?? 0;

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg text-sm ${
                isSelected
                  ? 'bg-calendar text-white'
                  : isToday
                    ? 'bg-calendar/10 text-calendar'
                    : inMonth
                      ? 'text-text hover:bg-surface-alt'
                      : 'text-text-muted/40'
              }`}
            >
              <span>{day.getDate()}</span>
              {count > 0 && (
                <span
                  className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-calendar'}`}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
