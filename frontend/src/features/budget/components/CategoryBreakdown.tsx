import { useState } from 'react';
import { AlertTriangle, PieChart, Settings2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/date';
import { Category, CategorySummary } from '../api/types';
import { CategoryLimitFormModal } from './CategoryLimitFormModal';

interface CategoryBreakdownProps {
  items: CategorySummary[];
  categories: Category[];
}

export function CategoryBreakdown({ items, categories }: CategoryBreakdownProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const expenseItems = items.filter((i) => i.type === 'expense').sort((a, b) => b.amount - a.amount);
  const total = expenseItems.reduce((sum, i) => sum + i.amount, 0);
  const categoryById = new Map(categories.map((c) => [c.id, c]));

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
            const category = categoryById.get(item.categoryId);
            const limit = category?.monthlyLimit ?? null;
            const isOver = limit != null && item.amount > limit;
            const ratio = limit != null ? Math.min(Math.round((item.amount / limit) * 100), 100) : total > 0 ? Math.round((item.amount / total) * 100) : 0;

            return (
              <div key={item.categoryId} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text">{item.categoryName}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isOver ? 'text-expense' : 'text-text'}`}>
                      {formatCurrency(item.amount)}
                      {limit != null && <span className="text-text-muted"> / {formatCurrency(limit)}</span>}
                    </span>
                    {category && (
                      <button
                        onClick={() => setEditingCategory(category)}
                        aria-label={`${item.categoryName}の目標を編集`}
                        className="text-text-muted hover:text-text"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
                  <div
                    className={`h-full rounded-full ${isOver ? 'bg-danger' : 'bg-expense'}`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
                {isOver && (
                  <p className="flex items-center gap-1 text-xs font-medium text-danger">
                    <AlertTriangle className="h-3 w-3" />
                    目標を{formatCurrency(item.amount - limit!)}超過しています
                  </p>
                )}
              </div>
            );
          })
        )}
      </CardContent>

      <CategoryLimitFormModal
        open={editingCategory !== null}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        category={editingCategory}
      />
    </Card>
  );
}
