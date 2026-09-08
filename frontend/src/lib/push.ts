import { api } from './api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** 許可ダイアログはユーザーの明示的な操作(プライミングバナーの「許可する」)経由でのみ呼び出す */
export async function requestNotificationPermissionAndSubscribe(): Promise<NotificationPermission> {
  if (!isPushSupported()) return 'denied';

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return permission;

  try {
    const { publicKey } = await api.get<{ publicKey: string }>('/api/notification/vapid-public-key');
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
    });
    await api.post('/api/notification/subscribe', subscription.toJSON());
  } catch (err) {
    // バックエンド未接続でも許可自体は成功として扱う(接続後に再購読される想定)
    console.warn('[push] 購読処理に失敗しました(バックエンド未接続の可能性):', err);
  }

  return permission;
}
