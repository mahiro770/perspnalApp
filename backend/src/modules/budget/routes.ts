import { Hono } from 'hono';
import type { AppEnv } from '../../app';
import { getCurrentUser } from '../../core/currentUser';
import * as service from './service';

const app = new Hono<AppEnv>();

// 公開APIのフィールド名(amount/date)はフロントエンドの命名。DB/内部層は
// amountMinor/transactionDateのまま(design docの命名)なので、この境界で変換する。
function toTransactionDto(tx: {
  id: string;
  categoryId: string;
  amountMinor: number;
  type: string;
  transactionDate: string;
  memo: string | null;
}) {
  return {
    id: tx.id,
    categoryId: tx.categoryId,
    amount: tx.amountMinor,
    type: tx.type,
    date: tx.transactionDate,
    memo: tx.memo ?? undefined,
  };
}

function toCategoryDto(cat: { id: string; name: string; type: string; color: string | null }) {
  return { id: cat.id, name: cat.name, type: cat.type, color: cat.color ?? '#94a3b8' };
}

app.get('/transactions', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const transactions = await service.listTransactions(
    db,
    user.id,
    c.req.query('from'),
    c.req.query('to'),
    c.req.query('type'),
  );
  return c.json(transactions.map(toTransactionDto));
});

app.post('/transactions', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  const transaction = await service.createTransaction(db, user.id, body);
  return c.json(toTransactionDto(transaction), 201);
});

app.put('/transactions/:id', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  const transaction = await service.updateTransaction(db, user.id, c.req.param('id'), body);
  return c.json(toTransactionDto(transaction));
});

app.delete('/transactions/:id', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  await service.deleteTransaction(db, user.id, c.req.param('id'));
  return c.body(null, 204);
});

app.get('/categories', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const categories = await service.listCategories(db, user.id);
  return c.json(categories.map(toCategoryDto));
});

app.post('/categories', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const body = await c.req.json().catch(() => ({}));
  const category = await service.createCategory(db, user.id, body);
  return c.json(toCategoryDto(category), 201);
});

app.get('/summary', async (c) => {
  const db = c.get('db');
  const user = await getCurrentUser(db);
  const summary = await service.getMonthlySummary(db, user.id, c.req.query('month'));
  return c.json(summary);
});

export default app;
