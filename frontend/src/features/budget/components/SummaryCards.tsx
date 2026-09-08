import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/date';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
}

export function SummaryCards({ totalIncome, totalExpense }: SummaryCardsProps) {
  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="p-3">
        <p className="text-xs text-text-muted">収入</p>
        <p className="mt-1 text-lg font-bold text-income">{formatCurrency(totalIncome)}</p>
      </Card>
      <Card className="p-3">
        <p className="text-xs text-text-muted">支出</p>
        <p className="mt-1 text-lg font-bold text-expense">{formatCurrency(totalExpense)}</p>
      </Card>
      <Card className="p-3">
        <p className="text-xs text-text-muted">収支</p>
        <p className={`mt-1 text-lg font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
          {formatCurrency(balance)}
        </p>
      </Card>
    </div>
  );
}
