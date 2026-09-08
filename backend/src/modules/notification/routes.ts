import { Hono } from 'hono';
import type { AppEnv } from '../../app';
import { getCurrentUser } from '../../core/currentUser';
import * as service from './service';

const app = new Hono<AppEnv>();

app.get('/vapid-public-key', (c) => c.json({ publicKey: service.getVapidPublicKey(c.env) }));

app.post('/subscribe', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  const subscription = await service.subscribe(db, user.id, body);
  return c.json({ subscription }, 201);
});

app.delete('/subscribe/:id', async (c) => {
  const db = c.get('db');
  await service.unsubscribe(db, c.req.param('id'));
  return c.body(null, 204);
});

export default app;
