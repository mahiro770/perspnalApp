import { useState } from 'react';
import { CalendarPlus, MapPin, Receipt, Wallet } from 'lucide-react';
import { Badge, Button, Modal } from '@/components/ui';
import { formatCurrency, formatDateLabel, getMonthRange, toMonthKey } from '@/lib/date';
import { CalendarEvent } from '../api/types';
import { useEvents } from '../hooks/useCalendar';
import { EventFormModal } from './EventFormModal';
import { useCategories, useTransactions } from '@/features/budget/hooks/useBudget';
import { TransactionFormModal } from '@/features/budget/components/TransactionFormModal';
import { Transaction } from '@/features/budget/api/types';

interface DayDetailSheetProps {
  dateKey: string;
  onClose: () => void;
}

export function DayDetailSheet({ dateKey, onClose }: DayDetailSheetProps) {
  const { from, to } = getMonthRange(toMonthKey(new Date(`${dateKey}T00:00:00`)));
  const { data: events = [] } = useEvents(from, to);
  const { data: transactions = [] } = useTransactions(dateKey, dateKey);
  const { data: categories = [] } = useCategories();

  const dayEvents = events.filter((e) => e.startAt.slice(0, 10) === dateKey);

  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>(undefined);
  const [txFormOpen, setTxFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | undefined>(undefined);

  const date = new Date(`${dateKey}T00:00:00`);

  return (
    <>
      <Modal open onOpenChange={(open) => !open && onClose()} title={formatDateLabel(date)} sheet>
        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text">予定</h4>
              <Button
                size="sm"
                variant="calendar"
                onClick={() => {
                  setEditingEvent(undefined);
                  setEventFormOpen(true);
                }}
              >
                <CalendarPlus className="h-4 w-4" />
                予定を追加
              </Button>
            </div>
            {dayEvents.length === 0 ? (
              <p className="text-xs text-text-muted">予定はありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {dayEvents.map((ev) => (
                  <li key={ev.id}>
                    <button
                      onClick={() => {
                        setEditingEvent(ev);
                        setEventFormOpen(true);
                      }}
                      className="flex w-full flex-col gap-1 rounded-lg border border-border px-3 py-2 text-left hover:bg-surface-alt"
                    >
                      <div className="flex items-center gap-2">
                        {ev.allDay ? (
                          <Badge tone="calendar">終日</Badge>
                        ) : (
                          <span className="text-xs text-text-muted">
                            {ev.startAt.slice(11, 16)} - {ev.endAt.slice(11, 16)}
                          </span>
                        )}
                        <span className="text-sm font-medium text-text">{ev.title}</span>
                      </div>
                      {ev.location && (
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <MapPin className="h-3 w-3" />
                          {ev.location}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text">支出・収入</h4>
              <Button
                size="sm"
                variant="expense"
                onClick={() => {
                  setEditingTx(undefined);
                  setTxFormOpen(true);
                }}
              >
                <Wallet className="h-4 w-4" />
                支出を記録
              </Button>
            </div>
            {transactions.length === 0 ? (
              <p className="text-xs text-text-muted">記録はありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {transactions.map((tx) => {
                  const category = categories.find((c) => c.id === tx.categoryId);
                  return (
                    <li key={tx.id}>
                      <button
                        onClick={() => {
                          setEditingTx(tx);
                          setTxFormOpen(true);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left hover:bg-surface-alt"
                      >
                        <Receipt className="h-4 w-4 text-text-muted" />
                        <span className="flex-1 text-sm text-text">{category?.name ?? '未分類'}</span>
                        <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                          {tx.type === 'income' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </Modal>

      <EventFormModal open={eventFormOpen} onOpenChange={setEventFormOpen} defaultDate={dateKey} event={editingEvent} />
      <TransactionFormModal open={txFormOpen} onOpenChange={setTxFormOpen} defaultDate={dateKey} transaction={editingTx} />
    </>
  );
}
