import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { getMonthRange } from '@/lib/date';
import { useEvents } from '../hooks/useCalendar';
import { useTransactions } from '@/features/budget/hooks/useBudget';
import { CalendarEvent } from '../api/types';
import { MonthGrid } from './MonthGrid';
import { DayDetailSheet } from './DayDetailSheet';
import { EventFormModal } from './EventFormModal';

export function CalendarPage() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const { from, to } = getMonthRange(`${year}-${String(month + 1).padStart(2, '0')}`);
  const { data: events = [] } = useEvents(from, to);
  const { data: transactions = [] } = useTransactions(from, to);

  function changeMonth(delta: number) {
    setViewDate(new Date(year, month + delta, 1));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="hidden text-xl font-bold text-text md:block">カレンダー</h1>
        <div className="flex flex-1 items-center justify-between md:flex-none md:gap-1">
          <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} aria-label="前の月">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-base font-semibold text-text">
            {year}年{month + 1}月
          </span>
          <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} aria-label="次の月">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <MonthGrid
        year={year}
        month={month}
        events={events}
        transactions={transactions}
        selectedDate={selectedDate ?? ''}
        onSelectDate={setSelectedDate}
        onSelectEvent={setOpenEvent}
      />

      <p className="text-center text-xs text-text-muted">
        日付・金額のボタンをタップすると内訳を、予定のボタンをタップすると内容を確認できます
      </p>

      {selectedDate && <DayDetailSheet dateKey={selectedDate} onClose={() => setSelectedDate(null)} />}

      {openEvent && (
        <EventFormModal
          open
          onOpenChange={(open) => !open && setOpenEvent(null)}
          defaultDate={openEvent.startAt.slice(0, 10)}
          event={openEvent}
        />
      )}
    </div>
  );
}
