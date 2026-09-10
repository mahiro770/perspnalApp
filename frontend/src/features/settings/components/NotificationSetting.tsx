import { useState } from 'react';
import { BellOff } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui';
import { useNotificationStore } from '@/stores/notificationStore';
import { isPushSupported, requestNotificationPermissionAndSubscribe } from '@/lib/push';

export function NotificationSetting() {
  const { primingStatus, setPrimingStatus, reminderTime, setReminderTime } = useNotificationStore();
  const [requesting, setRequesting] = useState(false);

  const browserPermission = isPushSupported() ? Notification.permission : 'denied';
  const isGranted = primingStatus === 'granted' && browserPermission === 'granted';

  async function handleEnable() {
    setRequesting(true);
    const permission = await requestNotificationPermissionAndSubscribe();
    setPrimingStatus(permission === 'granted' ? 'granted' : 'dismissed');
    setRequesting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知</CardTitle>
        {isGranted ? <Badge tone="income">有効</Badge> : <Badge tone="default">未設定</Badge>}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        {!isGranted && (
          <Button size="sm" onClick={handleEnable} disabled={requesting || !isPushSupported()}>
            <BellOff className="h-4 w-4" />
            {requesting ? '確認中…' : 'プッシュ通知を許可する'}
          </Button>
        )}
        <div>
          <Label htmlFor="reminder-time">毎日のリマインダー時刻</Label>
          <Input
            id="reminder-time"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="!w-40"
          />
        </div>
      </CardContent>
    </Card>
  );
}
