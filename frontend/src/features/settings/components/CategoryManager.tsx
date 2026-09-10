import { FormEvent, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select } from '@/components/ui';
import { useCategories, useCreateCategory } from '@/features/budget/hooks/useBudget';
import { TransactionType } from '@/features/budget/api/types';

export function CategoryManager() {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateCategory();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate(
      { name: name.trim(), type, color: '' },
      { onSuccess: () => setName('') },
    );
  }

  const income = categories.filter((c) => c.type === 'income');
  const expense = categories.filter((c) => c.type === 'expense');

  return (
    <Card>
      <CardHeader>
        <CardTitle>家計簿カテゴリ管理</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-text-muted">収入</p>
            <ul className="flex flex-col gap-1.5">
              {income.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm text-text">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-text-muted">支出</p>
            <ul className="flex flex-col gap-1.5">
              {expense.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm text-text">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={handleAdd} className="border-t border-border pt-3">
          <Label htmlFor="new-category-name">新しいカテゴリを追加</Label>
          <div className="flex items-center gap-2">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-24 flex-shrink-0"
            >
              <option value="expense">支出</option>
              <option value="income">収入</option>
            </Select>
            <Input
              id="new-category-name"
              placeholder="カテゴリ名を入力"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full flex-1"
            />
            <Button type="submit" size="icon" disabled={createMutation.isPending} aria-label="カテゴリを追加">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
