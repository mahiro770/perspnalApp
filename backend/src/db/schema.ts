import { relations } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

const id = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = (column = 'created_at') =>
  integer(column, { mode: 'timestamp' }).notNull().$defaultFn(() => new Date());
const updatedAt = (column = 'updated_at') =>
  integer(column, { mode: 'timestamp' }).notNull().$defaultFn(() => new Date());

export const users = sqliteTable('users', {
  id: id(),
  displayName: text('display_name').notNull(),
  email: text('email').unique(),
  timezone: text('timezone').notNull().default('Asia/Tokyo'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const calendarEvents = sqliteTable(
  'calendar_events',
  {
    id: id(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    location: text('location'),
    startAt: integer('start_at', { mode: 'timestamp' }).notNull(),
    endAt: integer('end_at', { mode: 'timestamp' }),
    allDay: integer('all_day', { mode: 'boolean' }).notNull().default(false),
    recurrenceRule: text('recurrence_rule'),
    category: text('category'),
    reminderMinutesBefore: integer('reminder_minutes_before'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  (table) => ({
    userStartIdx: index('calendar_events_user_start_idx').on(table.userId, table.startAt),
    startAtIdx: index('calendar_events_start_at_idx').on(table.startAt),
    deletedAtIdx: index('calendar_events_deleted_at_idx').on(table.deletedAt),
  }),
);

export const budgetCategories = sqliteTable(
  'budget_categories',
  {
    id: id(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: text('type', { enum: ['income', 'expense'] }).notNull(),
    color: text('color'),
    icon: text('icon'),
    sortOrder: integer('sort_order').notNull().default(0),
    isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
    // 月ごとの上限額(支出カテゴリの予算アラート用)。未設定はnull。
    monthlyLimitMinor: integer('monthly_limit_minor'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    userNameTypeKey: uniqueIndex('budget_categories_user_name_type_key').on(table.userId, table.name, table.type),
  }),
);

export const budgetTransactions = sqliteTable(
  'budget_transactions',
  {
    id: id(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => budgetCategories.id),
    calendarEventId: text('calendar_event_id').references(() => calendarEvents.id, { onDelete: 'set null' }),
    type: text('type', { enum: ['income', 'expense'] }).notNull(),
    amountMinor: integer('amount_minor').notNull(),
    currency: text('currency').notNull().default('JPY'),
    transactionDate: text('transaction_date').notNull(),
    paymentMethod: text('payment_method'),
    memo: text('memo'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  (table) => ({
    userDateIdx: index('budget_transactions_user_date_idx').on(table.userId, table.transactionDate),
    categoryIdx: index('budget_transactions_category_idx').on(table.categoryId),
    calendarEventIdx: index('budget_transactions_calendar_event_idx').on(table.calendarEventId),
  }),
);

export const budgetGoals = sqliteTable(
  'budget_goals',
  {
    id: id(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    month: text('month').notNull(),
    targetAmountMinor: integer('target_amount_minor').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => ({
    userMonthKey: uniqueIndex('budget_goals_user_month_key').on(table.userId, table.month),
  }),
);

export const weatherLocations = sqliteTable(
  'weather_locations',
  {
    id: id(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    areaCode: text('area_code').notNull(),
    areaName: text('area_name').notNull(),
    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: createdAt(),
  },
  (table) => ({
    userAreaKey: uniqueIndex('weather_locations_user_area_key').on(table.userId, table.areaCode),
  }),
);

// user_idを持たない: 地域コード単位で常に最新1件を保持する共有キャッシュのため
export const weatherCache = sqliteTable(
  'weather_cache',
  {
    id: id(),
    areaCode: text('area_code').notNull(),
    kind: text('kind').notNull(),
    rawPayload: text('raw_payload').notNull(),
    fetchedAt: integer('fetched_at', { mode: 'timestamp' }).notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: createdAt(),
  },
  (table) => ({
    areaKindKey: uniqueIndex('weather_cache_area_kind_key').on(table.areaCode, table.kind),
  }),
);

export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id: id(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull().unique(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  userAgent: text('user_agent'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),
  createdAt: createdAt(),
});

export const usersRelations = relations(users, ({ many }) => ({
  calendarEvents: many(calendarEvents),
  budgetCategories: many(budgetCategories),
  budgetTransactions: many(budgetTransactions),
  budgetGoals: many(budgetGoals),
  weatherLocations: many(weatherLocations),
  pushSubscriptions: many(pushSubscriptions),
}));

export const budgetGoalsRelations = relations(budgetGoals, ({ one }) => ({
  user: one(users, { fields: [budgetGoals.userId], references: [users.id] }),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one, many }) => ({
  user: one(users, { fields: [calendarEvents.userId], references: [users.id] }),
  budgetTransactions: many(budgetTransactions),
}));

export const budgetCategoriesRelations = relations(budgetCategories, ({ one, many }) => ({
  user: one(users, { fields: [budgetCategories.userId], references: [users.id] }),
  transactions: many(budgetTransactions),
}));

export const budgetTransactionsRelations = relations(budgetTransactions, ({ one }) => ({
  user: one(users, { fields: [budgetTransactions.userId], references: [users.id] }),
  category: one(budgetCategories, {
    fields: [budgetTransactions.categoryId],
    references: [budgetCategories.id],
  }),
  calendarEvent: one(calendarEvents, {
    fields: [budgetTransactions.calendarEventId],
    references: [calendarEvents.id],
  }),
}));

export const weatherLocationsRelations = relations(weatherLocations, ({ one }) => ({
  user: one(users, { fields: [weatherLocations.userId], references: [users.id] }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, { fields: [pushSubscriptions.userId], references: [users.id] }),
}));
