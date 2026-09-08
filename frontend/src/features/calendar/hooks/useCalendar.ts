import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NewEventInput } from '../api/types';
import { createEvent, deleteEvent, fetchEvents, fetchTodayEvents, updateEvent } from '../api/calendarApi';
import { useNotificationStore } from '@/stores/notificationStore';

export function useEvents(from: string, to: string) {
  return useQuery({
    queryKey: ['calendar', 'events', from, to],
    queryFn: () => fetchEvents(from, to),
  });
}

export function useTodayEvents() {
  return useQuery({
    queryKey: ['calendar', 'events', 'today'],
    queryFn: fetchTodayEvents,
  });
}

function useInvalidateCalendar() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['calendar'] });
}

export function useCreateEvent() {
  const invalidate = useInvalidateCalendar();
  const triggerPriming = useNotificationStore((s) => s.triggerPriming);
  return useMutation({
    mutationFn: (input: NewEventInput) => createEvent(input),
    onSuccess: () => {
      invalidate();
      // 最初の予定作成直後に通知許可のプライミングバナーを表示するトリガー
      triggerPriming();
    },
  });
}

export function useUpdateEvent() {
  const invalidate = useInvalidateCalendar();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: NewEventInput }) => updateEvent(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteEvent() {
  const invalidate = useInvalidateCalendar();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: invalidate,
  });
}
