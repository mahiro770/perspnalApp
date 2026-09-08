import { Card, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/date';
import { Receipt } from 'lucide-react';
import { Category, Transaction } from '../api/types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onSelect: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, categories, onSelect }: TransactionListProps) {
  if (transactions.length === 0) {
    return <EmptyState icon={Receipt} title="取引がありません" description="右下のボタンから記録できます" />;
  }

  return (
    <Card className="divide-y divide-border">
      {transactions.map((tx) => {
        const category = categories.find((c) => c.id === tx.categoryId);
        return (
          <button
            key={tx.id}
            onClick={() => onSelect(tx)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-alt"
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: category?.color ?? '#94a3b8' }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{category?.name ?? '未分類'}</p>
              {tx.memo && <p className="truncate text-xs text-text-muted">{tx.memo}</p>}
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                {tx.type === 'income' ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </p>
              <p className="text-[11px] text-text-muted">{tx.date}</p>
            </div>
          </button>
        );
      })}
    </Card>
  );
}
