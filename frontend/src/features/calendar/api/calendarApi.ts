import { api } from '@/lib/api';
import { CalendarEvent, NewEventInput } from './types';
import { mockCreateEvent, mockDeleteEvent, mockListEvents, mockTodayEvents, mockUpdateEvent } from './mockData';

export async function fetchEvents(from: string, to: string): Promise<CalendarEvent[]> {
  try {
    return await api.get<CalendarEvent[]>(`/api/calendar/events?from=${from}&to=${to}`);
  } catch {
    return mockListEvents(from, to);
  }
}

export async function fetchTodayEvents(): Promise<CalendarEvent[]> {
  try {
    return await api.get<CalendarEvent[]>('/api/calendar/events/today');
  } catch {
    return mockTodayEvents();
  }
}

export async function createEvent(input: NewEventInput): Promise<CalendarEvent> {
  try {
    return await api.post<CalendarEvent>('/api/calendar/events', input);
  } catch {
    return mockCreateEvent(input);
  }
}

export async function updateEvent(id: string, input: NewEventInput): Promise<CalendarEvent> {
  try {
    return await api.put<CalendarEvent>(`/api/calendar/events/${id}`, input);
  } catch {
    return mockUpdateEvent(id, input);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await api.delete<void>(`/api/calendar/events/${id}`);
  } catch {
    mockDeleteEvent(id);
  }
}
