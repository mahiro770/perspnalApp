import { Hono } from 'hono';
import type { AppEnv } from '../app';
import weather from './weather/routes';
import calendar from './calendar/routes';
import budget from './budget/routes';
import notification from './notification/routes';

export function registerModules(app: Hono<AppEnv>) {
  app.route('/api/weather', weather);
  app.route('/api/calendar', calendar);
  app.route('/api/budget', budget);
  app.route('/api/notification', notification);
}
