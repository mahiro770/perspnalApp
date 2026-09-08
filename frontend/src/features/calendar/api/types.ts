export interface CalendarEvent {
  id: string;
  title: string;
  /** ISO日時 */
  startAt: string;
  endAt: string;
  allDay: boolean;
  location?: string;
  memo?: string;
}

export type NewEventInput = Omit<CalendarEvent, 'id'>;
