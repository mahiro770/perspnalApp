import { Bell, X } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { useNotificationStore } from '@/stores/notificationStore';
import { requestNotificationPermissionAndSubscribe } from '@/lib/push';

/**
 * ブラウザ標準の許可ダイアログをいきなり出さず、
 * 最初の予定作成直後にアプリ内で理由を添えて確認する「プライミング」バナー。
 */
export function NotificationPrimingBanner() {
  const { primingTriggered, primingStatus, setPrimingStatus } = useNotificationStore();

  if (!primingTriggered || primingStatus !== 'unseen') return null;

  async function handleAllow() {
    const permission = await requestNotificationPermissionAndSubscribe();
    setPrimingStatus(permission === 'granted' ? 'granted' : 'dismissed');
  }

  return (
    <Card className="mb-4 flex items-start gap-3 border-primary/30 bg-primary/5 p-4">
      <Bell className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-text">予定の通知を受け取りますか?</p>
        <p className="mt-1 text-xs text-text-muted">
          天気の急変や予定の直前リマインダーをプッシュ通知でお知らせします。あとから設定画面でいつでも変更できます。
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={handleAllow}>
            許可する
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setPrimingStatus('later')}>
            あとで
          </Button>
        </div>
      </div>
      <button
        aria-label="閉じる"
        onClick={() => setPrimingStatus('dismissed')}
        className="rounded-md p-1 text-text-muted hover:bg-surface-alt"
      >
        <X className="h-4 w-4" />
      </button>
    </Card>
  );
}
