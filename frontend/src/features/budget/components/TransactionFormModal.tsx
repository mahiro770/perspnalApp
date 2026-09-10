import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input, Label, Select, Textarea } from '@/components/ui';
import { useCategories, useCreateTransaction, useDeleteTransaction, useUpdateTransaction } from '../hooks/useBudget';
import { Transaction, TransactionType } from '../api/types';
import { toDateKey } from '@/lib/date';

interface TransactionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: string;
  transaction?: Transaction;
}

export function TransactionFormModal({ open, onOpenChange, defaultDate, transaction }: TransactionFormModalProps) {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense');
  const [date, setDate] = useState(transaction?.date ?? defaultDate ?? toDateKey(new Date()));
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? '');
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '');
  const [memo, setMemo] = useState(transaction?.memo ?? '');

  const categoriesForType = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (!open) return;
    setType(transaction?.type ?? 'expense');
    setDate(transaction?.date ?? defaultDate ?? toDateKey(new Date()));
    setCategoryId(transaction?.categoryId ?? '');
    setAmount(transaction ? String(transaction.amount) : '');
    setMemo(transaction?.memo ?? '');
  }, [open, transaction, defaultDate]);

  useEffect(() => {
    if (categoriesForType.length > 0 && !categoriesForType.some((c) => c.id === categoryId)) {
      setCategoryId(categoriesForType[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, categories]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const input = { date, type, categoryId, amount: Number(amount), memo: memo || undefined };
    if (transaction) {
      updateMutation.mutate({ id: transaction.id, input }, { onSuccess: () => onOpenChange(false) });
    } else {
      createMutation.mutate(input, { onSuccess: () => onOpenChange(false) });
    }
  }

  function handleDelete() {
    if (!transaction) return;
    deleteMutation.mutate(transaction.id, { onSuccess: () => onOpenChange(false) });
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={transaction ? '取引を編集' : '支出・収入を記録'} sheet>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === 'expense' ? 'expense' : 'secondary'}
            className="flex-1"
            onClick={() => setType('expense')}
          >
            支出
          </Button>
          <Button
            type="button"
            variant={type === 'income' ? 'income' : 'secondary'}
            className="flex-1"
            onClick={() => setType('income')}
          >
            収入
          </Button>
        </div>

        <div>
          <Label htmlFor="tx-date">日付</Label>
          <Input id="tx-date" type="date" className="w-full" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="tx-category">カテゴリ</Label>
          <Select
            id="tx-category"
            className="w-full"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categoriesForType.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="tx-amount">金額</Label>
          <Input
            id="tx-amount"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="1000"
            className="w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="tx-memo">メモ(任意)</Label>
          <Textarea id="tx-memo" rows={2} className="w-full" value={memo} onChange={(e) => setMemo(e.target.value)} />
        </div>

        <div className="mt-2 flex gap-2">
          {transaction && (
            <Button type="button" variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
              削除
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={isSaving}>
            {isSaving ? '保存中…' : '保存する'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
