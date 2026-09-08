import { createApp, type Env } from './app';
import { createDb } from './db';
import { refreshAllCachedRegions } from './modules/weather/service';
import { runDailyNotificationJob } from './modules/notification/jobs';

const app = createApp();

const WEATHER_REFRESH_CRON = '*/30 * * * *';
const DAILY_NOTIFICATION_CRON = '0 22 * * *';

export default {
  fetch: app.fetch,

  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
    const db = createDb(env.DB);

    if (event.cron === DAILY_NOTIFICATION_CRON) {
      ctx.waitUntil(runDailyNotificationJob(db, env));
      return;
    }

    if (event.cron === WEATHER_REFRESH_CRON) {
      ctx.waitUntil(refreshAllCachedRegions(db));
      return;
    }

    console.warn(`unhandled cron trigger: ${event.cron}`);
  },
} satisfies ExportedHandler<Env>;
