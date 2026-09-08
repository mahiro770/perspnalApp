import type { Env } from '../../app';
import { getCurrentUser } from '../../core/currentUser';
import type { Db } from '../../db';
import * as service from './service';

export async function runDailyNotificationJob(db: Db, env: Env) {
  const user = await getCurrentUser(db);
  const result = await service.sendDailyDigest(db, env, user.id);
  console.log(`daily notification job: sent=${result.sent}/${result.total}`);
}
