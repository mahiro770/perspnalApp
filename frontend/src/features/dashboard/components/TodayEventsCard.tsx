import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ChevronRight, MapPin } from 'lucide-react';
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { toDateKey } from '@/lib/date';
import { useEvents } from '@/features/calendar/hooks/useCalendar';
import { EventFormModal } from '@/features/calendar/components/EventFormModal';
import { CalendarEvent } from '@/features/calendar/api/types';

export function TodayEventsCard() {
  const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const todayKey = toDateKey(today);
  const tomorrowKey = toDateKey(tomorrow);

  const { data: events = [] } = useEvents(todayKey, tomorrowKey);
  const todayEvents = events.filter((e) => e.startAt.slice(0, 10) === todayKey);
  const tomorrowEvents = events.filter((e) => e.startAt.slice(0, 10) === tomorrowKey);

  return (
    <Card>
      <CardHeader>
        <CardTitle>今日・明日の予定</CardTitle>
        <Link to="/calendar" className="flex items-center text-xs text-text-muted hover:text-text">
          カレンダーへ
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 pt-2">
        {todayEvents.length === 0 && tomorrowEvents.length === 0 ? (
          <EmptyState icon={CalendarClock} title="今日・明日の予定はありません" />
        ) : (
          <>
            {todayEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setOpenEvent(ev)}
                className="flex items-center gap-2 rounded-lg p-1.5 text-left text-sm hover:bg-surface-alt"
              >
                <Badge tone="calendar">今日</Badge>
                <span className="w-11 text-xs text-text-muted">{ev.allDay ? '終日' : ev.startAt.slice(11, 16)}</span>
                <span className="flex-1 truncate text-text">{ev.title}</span>
                {ev.location && <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-text-muted" />}
              </button>
            ))}
            {tomorrowEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setOpenEvent(ev)}
                className="flex items-center gap-2 rounded-lg p-1.5 text-left text-sm hover:bg-surface-alt"
              >
                <Badge tone="default">明日</Badge>
                <span className="w-11 text-xs text-text-muted">{ev.allDay ? '終日' : ev.startAt.slice(11, 16)}</span>
                <span className="flex-1 truncate text-text">{ev.title}</span>
                {ev.location && <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-text-muted" />}
              </button>
            ))}
          </>
        )}
      </CardContent>

      {openEvent && (
        <EventFormModal
          open
          onOpenChange={(open) => !open && setOpenEvent(null)}
          defaultDate={openEvent.startAt.slice(0, 10)}
          event={openEvent}
        />
      )}
    </Card>
  );
}
