import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/date';
import { PieChart } from 'lucide-react';
import { CategorySummary } from '../api/types';

export function CategoryBreakdown({ items }: { items: CategorySummary[] }) {
  const expenseItems = items.filter((i) => i.type === 'expense').sort((a, b) => b.amount - a.amount);
  const total = expenseItems.reduce((sum, i) => sum + i.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>カテゴリ別支出</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {expenseItems.length === 0 ? (
          <EmptyState icon={PieChart} title="この月の支出はまだありません" />
        ) : (
          expenseItems.map((item) => {
            const ratio = total > 0 ? Math.round((item.amount / total) * 100) : 0;
            return (
              <div key={item.categoryId} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text">{item.categoryName}</span>
                  <span className="font-medium text-text">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                  <div className="h-full rounded-full bg-expense" style={{ width: `${ratio}%` }} />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
