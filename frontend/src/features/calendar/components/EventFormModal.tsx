import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input, Label, Textarea } from '@/components/ui';
import * as Switch from '@radix-ui/react-switch';
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from '../hooks/useCalendar';
import { CalendarEvent } from '../api/types';

interface EventFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate: string;
  event?: CalendarEvent;
}

export function EventFormModal({ open, onOpenChange, defaultDate, event }: EventFormModalProps) {
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const [title, setTitle] = useState(event?.title ?? '');
  const [allDay, setAllDay] = useState(event?.allDay ?? false);
  const [date, setDate] = useState(event?.startAt.slice(0, 10) ?? defaultDate);
  const [startTime, setStartTime] = useState(event ? event.startAt.slice(11, 16) : '09:00');
  const [endTime, setEndTime] = useState(event ? event.endAt.slice(11, 16) : '10:00');
  const [location, setLocation] = useState(event?.location ?? '');
  const [memo, setMemo] = useState(event?.memo ?? '');

  useEffect(() => {
    if (!open) return;
    setTitle(event?.title ?? '');
    setAllDay(event?.allDay ?? false);
    setDate(event?.startAt.slice(0, 10) ?? defaultDate);
    setStartTime(event ? event.startAt.slice(11, 16) : '09:00');
    setEndTime(event ? event.endAt.slice(11, 16) : '10:00');
    setLocation(event?.location ?? '');
    setMemo(event?.memo ?? '');
  }, [open, event, defaultDate]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // ローカル日時の文字列をそのまま保持する(UTC変換すると日時がずれるため)
    const startAt = allDay ? `${date}T00:00:00` : `${date}T${startTime}:00`;
    const endAt = allDay ? `${date}T23:59:00` : `${date}T${endTime}:00`;
    const input = {
      title,
      startAt,
      endAt,
      allDay,
      location: location || undefined,
      memo: memo || undefined,
    };
    if (event) {
      updateMutation.mutate({ id: event.id, input }, { onSuccess: () => onOpenChange(false) });
    } else {
      createMutation.mutate(input, { onSuccess: () => onOpenChange(false) });
    }
  }

  function handleDelete() {
    if (!event) return;
    deleteMutation.mutate(event.id, { onSuccess: () => onOpenChange(false) });
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={event ? '予定を編集' : '予定を追加'} sheet>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Label htmlFor="ev-title">タイトル</Label>
          <Input
            id="ev-title"
            className="w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="打ち合わせ"
          />
        </div>

        <div>
          <Label htmlFor="ev-date">日付</Label>
          <Input id="ev-date" type="date" className="w-full" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="ev-allday" className="mb-0">
            終日
          </Label>
          <Switch.Root
            id="ev-allday"
            checked={allDay}
            onCheckedChange={setAllDay}
            className="relative h-6 w-11 rounded-full bg-surface-alt data-[state=checked]:bg-calendar"
          >
            <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>

        {!allDay && (
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="ev-start">開始</Label>
              <Input id="ev-start" type="time" className="w-full" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="flex-1">
              <Label htmlFor="ev-end">終了</Label>
              <Input id="ev-end" type="time" className="w-full" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="ev-location">場所(任意)</Label>
          <Input id="ev-location" className="w-full" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="ev-memo">メモ(任意)</Label>
          <Textarea id="ev-memo" rows={2} className="w-full" value={memo} onChange={(e) => setMemo(e.target.value)} />
        </div>

        <div className="mt-2 flex gap-2">
          {event && (
            <Button type="button" variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
              削除
            </Button>
          )}
          <Button type="submit" variant="calendar" className="flex-1" disabled={isSaving}>
            {isSaving ? '保存中…' : '保存する'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
