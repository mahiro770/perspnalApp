import { buildPushPayload } from '@block65/webcrypto-web-push';
import type { PushMessage, PushSubscription, VapidKeys } from '@block65/webcrypto-web-push';

// web-push (npm) はNode組み込みcryptoに依存する実装が多くCloudflare Workersでは動作しない。
// @block65/webcrypto-web-push はWeb Crypto APIのみで動作し、Workers/Deno/ブラウザで実績がある。
// fetch自体は呼ばず、fetchにそのまま渡せるRequestInitを組み立てるだけなので、
// 送信結果(ステータスコード)をこちら側で見て購読の無効化判定ができる。
export interface PushEnv {
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_SUBJECT: string;
}

export interface PushTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushSendResult {
  ok: boolean;
  status: number;
  expired: boolean;
}

export async function sendWebPush(
  env: PushEnv,
  target: PushTarget,
  payload: unknown,
): Promise<PushSendResult> {
  const subscription: PushSubscription = {
    endpoint: target.endpoint,
    expirationTime: null,
    keys: { p256dh: target.p256dh, auth: target.auth },
  };

  const vapidKeys: VapidKeys = {
    subject: env.VAPID_SUBJECT,
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
  };

  const message: PushMessage = {
    data: JSON.stringify(payload),
    options: { ttl: 60 * 60 },
  };

  const init = await buildPushPayload(message, subscription, vapidKeys);
  const response = await fetch(target.endpoint, init as RequestInit);

  // 410 Gone / 404 Not Found はエンドポイントが失効した合図(可用性優先で該当購読を無効化する)
  const expired = response.status === 404 || response.status === 410;
  return { ok: response.ok, status: response.status, expired };
}
