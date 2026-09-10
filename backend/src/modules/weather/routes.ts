import { Hono } from 'hono';
import type { AppEnv } from '../../app';
import { getCurrentUser } from '../../core/currentUser';
import { ValidationError } from '../../core/errors';
import * as service from './service';

const app = new Hono<AppEnv>();

app.get('/regions', (c) => c.json(service.listRegions()));

app.get('/forecast', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const result = await service.getForecast(db, user.id, c.req.query('regionCode'));
  return c.json(result);
});

app.post('/regions/default', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  if (typeof body?.regionCode !== 'string') throw new ValidationError('regionCode is required');
  const location = await service.setDefaultRegion(db, user.id, body.regionCode);
  return c.json(location);
});

app.get('/favorites', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const favorites = await service.listFavorites(db, user.id);
  return c.json(favorites);
});

app.post('/favorites', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  const favorite = await service.addFavorite(db, user.id, body?.regionCode);
  return c.json(favorite, 201);
});

app.delete('/favorites/:id', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  await service.removeFavorite(db, user.id, c.req.param('id'));
  return c.body(null, 204);
});

export default app;
