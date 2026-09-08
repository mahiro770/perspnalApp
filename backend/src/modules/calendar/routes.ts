import { Hono } from 'hono';
import type { AppEnv } from '../../app';
import { getCurrentUser } from '../../core/currentUser';
import * as service from './service';

const app = new Hono<AppEnv>();

// DBの内部列名(description)をフロントエンドの公開フィールド名(memo)に変換する。
// 家計簿側のmemoフィールドと命名を揃えるための境界層でのマッピング。
function toDto(event: {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date | null;
  allDay: boolean;
  location: string | null;
  description: string | null;
}) {
  return {
    id: event.id,
    title: event.title,
    startAt: event.startAt,
    endAt: event.endAt,
    allDay: event.allDay,
    location: event.location ?? undefined,
    memo: event.description ?? undefined,
  };
}

app.get('/events/today', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const events = await service.listToday(db, user.id);
  return c.json(events.map(toDto));
});

app.get('/events', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const events = await service.listEvents(db, user.id, c.req.query('from'), c.req.query('to'));
  return c.json(events.map(toDto));
});

app.post('/events', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  const event = await service.createEvent(db, user.id, body);
  return c.json(toDto(event), 201);
});

app.put('/events/:id', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  const event = await service.updateEvent(db, user.id, c.req.param('id'), body);
  return c.json(toDto(event));
});

app.delete('/events/:id', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  await service.deleteEvent(db, user.id, c.req.param('id'));
  return c.body(null, 204);
});

export default app;
