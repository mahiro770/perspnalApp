import { FormEvent, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';
import { useCategories, useCreateCategory, useDeleteCategory } from '@/features/budget/hooks/useBudget';
import { Category, TransactionType } from '@/features/budget/api/types';

export function CategoryManager() {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate(
      { name: name.trim(), type, color: '' },
      { onSuccess: () => setName('') },
    );
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
  }

  const income = categories.filter((c) => c.type === 'income');
  const expense = categories.filter((c) => c.type === 'expense');

  function CategoryItem({ category }: { category: Category }) {
    return (
      <li>
        <button
          onClick={() => setPendingDelete(category)}
          className="flex w-full items-center gap-2 rounded-md px-1 py-1 text-left text-sm text-text hover:bg-surface-alt"
        >
          <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
          {category.name}
        </button>
      </li>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>家計簿カテゴリ管理</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <p className="text-xs text-text-muted">カテゴリをタップすると削除できます</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 text-xs font-medium text-text-muted">収入</p>
            <ul className="flex flex-col gap-0.5">
              {income.map((c) => (
                <CategoryItem key={c.id} category={c} />
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-text-muted">支出</p>
            <ul className="flex flex-col gap-0.5">
              {expense.map((c) => (
                <CategoryItem key={c.id} category={c} />
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

      <Modal
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="カテゴリを削除しますか？"
      >
        <p className="text-sm text-text">
          「{pendingDelete?.name}」を削除します。このカテゴリを使っている過去の取引は残りますが、一覧やカテゴリ選択には表示されなくなります。
        </p>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setPendingDelete(null)}>
            キャンセル
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? '削除中…' : '削除する'}
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
