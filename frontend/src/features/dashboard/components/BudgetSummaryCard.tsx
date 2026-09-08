import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatCurrency, formatMonthLabel } from '@/lib/date';
import { currentMonthKey } from '@/features/budget/api/mockData';
import { useBudgetSummary } from '@/features/budget/hooks/useBudget';

export function BudgetSummaryCard() {
  const month = currentMonthKey();
  const { data: summary } = useBudgetSummary(month);
  const balance = (summary?.totalIncome ?? 0) - (summary?.totalExpense ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatMonthLabel(month)}の家計簿</CardTitle>
        <Link to="/budget" className="flex items-center text-xs text-text-muted hover:text-text">
          家計簿へ
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 pt-2 text-center">
        <div>
          <p className="text-xs text-text-muted">収入</p>
          <p className="text-base font-bold text-income">{formatCurrency(summary?.totalIncome ?? 0)}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">支出</p>
          <p className="text-base font-bold text-expense">{formatCurrency(summary?.totalExpense ?? 0)}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">収支</p>
          <p className={`text-base font-bold ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
