import { Hono } from 'hono';
import type { AppEnv } from '../../app';
import { getCurrentUser } from '../../core/currentUser';
import { ValidationError } from '../../core/errors';
import * as service from './service';

const app = new Hono<AppEnv>();

// ショートカットアプリ等からの送信はCloudflare Accessのブラウザログインを経由しないため、
// この一件だけ共有トークンで保護する(他のエンドポイントはAccess + CORSで保護されている)。
app.post('/', async (c) => {
  const token = c.req.header('X-Ingest-Token');
  if (!token || token !== c.env.HEALTH_INGEST_TOKEN) {
    throw new ValidationError('invalid or missing X-Ingest-Token header');
  }

  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  const result = await service.recordSteps(db, user.id, body);
  return c.json(result, 201);
});

app.get('/', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const result = await service.getSteps(db, user.id, c.req.query('groupBy'), c.req.query('from'), c.req.query('to'));
  return c.json(result);
});

export default app;
