import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input, Label } from '@/components/ui';
import { useSetGoal } from '../hooks/useBudget';
import { formatMonthLabel } from '@/lib/date';

interface GoalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: string;
  currentTarget: number;
}

export function GoalFormModal({ open, onOpenChange, month, currentTarget }: GoalFormModalProps) {
  const setGoalMutation = useSetGoal();
  const [targetAmount, setTargetAmount] = useState(currentTarget > 0 ? String(currentTarget) : '');

  useEffect(() => {
    if (!open) return;
    setTargetAmount(currentTarget > 0 ? String(currentTarget) : '');
  }, [open, currentTarget]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGoalMutation.mutate(
      { month, targetAmount: Number(targetAmount) || 0 },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={`${formatMonthLabel(month)}の貯金目標`} sheet>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Label htmlFor="goal-amount">目標貯金額</Label>
          <Input
            id="goal-amount"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="30000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
        </div>
        <p className="text-xs text-text-muted">
          その月の収支(収入-支出)がこの金額に達すると目標達成です。0円にすると目標を未設定に戻せます。
        </p>
        <Button type="submit" className="mt-2" disabled={setGoalMutation.isPending}>
          {setGoalMutation.isPending ? '保存中…' : '保存する'}
        </Button>
      </form>
    </Modal>
  );
}
