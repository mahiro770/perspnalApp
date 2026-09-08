import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createDb, type Db } from './db';
import { AppError } from './core/errors';
import { registerModules } from './modules/registry';

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGIN: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  VAPID_SUBJECT: string;
}

export interface Variables {
  db: Db;
}

export type AppEnv = { Bindings: Env; Variables: Variables };

export function createApp() {
  const app = new Hono<AppEnv>();

  app.use(
    '*',
    cors({
      origin: (_origin, c) => c.env.ALLOWED_ORIGIN,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Cf-Access-Authenticated-User-Email'],
      credentials: true,
    }),
  );

  app.use('*', async (c, next) => {
    c.set('db', createDb(c.env.DB));
    await next();
  });

  // Cloudflare Access側で既に認証済みが前提。ここではログ用途で読むだけに留める。
  app.use('*', async (c, next) => {
    const email = c.req.header('Cf-Access-Authenticated-User-Email');
    if (email) console.log(`[access] ${email} ${c.req.method} ${c.req.path}`);
    await next();
  });

  app.get('/api/health', (c) => c.json({ status: 'ok' }));

  registerModules(app);

  app.notFound((c) => c.json({ error: 'not_found' }, 404));

  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json({ error: err.message, code: err.code }, err.statusCode as 400 | 404 | 502);
    }
    console.error(err);
    return c.json({ error: 'internal_server_error' }, 500);
  });

  return app;
}
