import { useState } from 'react';
import { Pencil, Target } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/date';
import { GoalFormModal } from './GoalFormModal';

interface GoalCardProps {
  month: string;
  targetAmount: number;
  balance: number;
}

export function GoalCard({ month, targetAmount, balance }: GoalCardProps) {
  const [formOpen, setFormOpen] = useState(false);

  if (targetAmount <= 0) {
    return (
      <>
        <Card className="flex items-center justify-between gap-3 p-3">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Target className="h-4 w-4" />
            貯金目標が未設定です
          </div>
          <Button size="sm" variant="secondary" onClick={() => setFormOpen(true)}>
            目標を設定
          </Button>
        </Card>
        <GoalFormModal open={formOpen} onOpenChange={setFormOpen} month={month} currentTarget={targetAmount} />
      </>
    );
  }

  const achievedAmount = Math.max(balance, 0);
  const rate = Math.min(Math.round((achievedAmount / targetAmount) * 100), 100);
  const achieved = balance >= targetAmount;

  return (
    <>
      <Card className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Target className="h-3.5 w-3.5" />
            目標達成状況
          </div>
          <button
            onClick={() => setFormOpen(true)}
            aria-label="目標を編集"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text"
          >
            <Pencil className="h-3 w-3" />
            編集
          </button>
        </div>

        <div className="flex items-end justify-between">
          <p className="text-sm text-text">
            <span className={`text-lg font-bold ${achieved ? 'text-income' : 'text-text'}`}>
              {formatCurrency(achievedAmount)}
            </span>
            <span className="text-text-muted"> / {formatCurrency(targetAmount)}</span>
          </p>
          <span className={`text-sm font-semibold ${achieved ? 'text-income' : 'text-text-muted'}`}>
            {achieved ? '達成!' : `${rate}%`}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-alt">
          <div
            className={`h-full rounded-full transition-all ${achieved ? 'bg-income' : 'bg-primary'}`}
            style={{ width: `${rate}%` }}
          />
        </div>
      </Card>
      <GoalFormModal open={formOpen} onOpenChange={setFormOpen} month={month} currentTarget={targetAmount} />
    </>
  );
}
