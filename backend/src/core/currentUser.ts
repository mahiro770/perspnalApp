import type { Db } from '../db';
import { users } from '../db/schema';

// 単一ユーザー個人アプリのため、usersテーブルの最初の1件を「現在のユーザー」として扱う。
// 存在しなければ初回アクセス時に1件だけ作成する。
export async function getCurrentUser(db: Db) {
  const existing = await db.select().from(users).limit(1);
  if (existing[0]) return existing[0];

  const [created] = await db
    .insert(users)
    .values({ displayName: 'わたし' })
    .returning();
  return created;
}
