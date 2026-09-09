import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input, Label } from '@/components/ui';
import { useUpdateCategoryLimit } from '../hooks/useBudget';
import { Category } from '../api/types';

interface CategoryLimitFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function CategoryLimitFormModal({ open, onOpenChange, category }: CategoryLimitFormModalProps) {
  const updateMutation = useUpdateCategoryLimit();
  const [limit, setLimit] = useState('');

  useEffect(() => {
    if (!open || !category) return;
    setLimit(category.monthlyLimit != null ? String(category.monthlyLimit) : '');
  }, [open, category]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!category) return;
    const monthlyLimit = limit.trim() === '' ? null : Number(limit);
    updateMutation.mutate({ id: category.id, monthlyLimit }, { onSuccess: () => onOpenChange(false) });
  }

  if (!category) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={`「${category.name}」の月間目標`} sheet>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Label htmlFor="cat-limit">月の上限額</Label>
          <Input
            id="cat-limit"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="未設定"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>
        <p className="text-xs text-text-muted">
          この金額を超えて支出すると、カテゴリ別支出の一覧に超過アラートが表示されます。空欄にすると未設定に戻ります。
        </p>
        <Button type="submit" className="mt-2" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? '保存中…' : '保存する'}
        </Button>
      </form>
    </Modal>
  );
}
