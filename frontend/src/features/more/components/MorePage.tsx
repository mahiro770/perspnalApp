import { Link } from 'react-router-dom';
import { getOverflowNavItems } from '@/app/navigation';
import { EmptyState } from '@/components/ui';
import { MoreHorizontal } from 'lucide-react';

/**
 * ナビゲーション項目が MAX_BOTTOM_TABS を超えたときの受け皿画面。
 * 現在は5画面構成のため空だが、将来の画面追加時にレイアウトを変更せず対応できる。
 */
export function MorePage() {
  const items = getOverflowNavItems();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={MoreHorizontal}
        title="表示できる項目はありません"
        description="画面が増えると、ここに一覧が表示されます。"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.key}
          to={item.path}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-text hover:bg-surface-alt"
        >
          <item.icon className="h-5 w-5 text-text-muted" strokeWidth={1.75} />
          {item.label}
        </Link>
      ))}
    </div>
  );
}
