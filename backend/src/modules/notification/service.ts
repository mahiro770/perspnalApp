import type { Env } from '../../app';
import { sendWebPush } from '../../core/push';
import { NotFoundError, ValidationError } from '../../core/errors';
import type { Db } from '../../db';
import * as calendarService from '../calendar/service';
import * as repo from './repository';

export function getVapidPublicKey(env: Env) {
  return env.VAPID_PUBLIC_KEY;
}

export async function subscribe(db: Db, userId: string, body: any) {
  const endpoint = body?.endpoint;
  const p256dh = body?.keys?.p256dh;
  const auth = body?.keys?.auth;
  if (typeof endpoint !== 'string' || typeof p256dh !== 'string' || typeof auth !== 'string') {
    throw new ValidationError('endpoint and keys.p256dh/keys.auth are required');
  }

  const userAgent = typeof body.userAgent === 'string' ? body.userAgent : null;
  const existing = await repo.findByEndpoint(db, userId, endpoint);
  if (existing) {
    return repo.reactivateSubscription(db, existing.id, { p256dh, auth, userAgent });
  }
  return repo.createSubscription(db, userId, { endpoint, p256dh, auth, userAgent });
}

export async function unsubscribe(db: Db, id: string) {
  const deactivated = await repo.deactivateById(db, id);
  if (!deactivated) throw new NotFoundError('subscription not found');
  return deactivated;
}

export async function sendDailyDigest(db: Db, env: Env, userId: string) {
  const events = await calendarService.listToday(db, userId);
  if (events.length === 0) return { sent: 0, total: 0 };

  const subscriptions = await repo.listActiveSubscriptions(db);
  const payload = {
    title: 'くらしログ',
    body: `本日の予定が${events.length}件あります`,
    data: { events: events.map((e) => ({ id: e.id, title: e.title, startAt: e.startAt })) },
  };

  let sent = 0;
  for (const sub of subscriptions) {
    try {
      const result = await sendWebPush(env, { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth }, payload);
      if (result.expired) {
        await repo.deactivateById(db, sub.id);
      } else if (result.ok) {
        sent += 1;
        await repo.markUsed(db, sub.id);
      }
    } catch (err) {
      console.error(`push send failed for subscription ${sub.id}`, err);
    }
  }

  return { sent, total: subscriptions.length };
}
