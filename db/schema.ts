import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, decimal, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  
  // Subscription
  plan: text('plan').notNull().default('free'), // free, pro, elite
  credits: integer('credits').notNull().default(100),
  
  // Affiliate
  affiliateCode: text('affiliate_code').notNull().unique(),
  referredBy: text('referred_by'), // Affiliate code of referrer
  
  // Metadata
  emailVerified: boolean('email_verified').default(false),
  isActive: boolean('is_active').default(true),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
  affiliateCodeIdx: index('affiliate_code_idx').on(table.affiliateCode),
}));

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Razorpay data
  razorpaySubscriptionId: text('razorpay_subscription_id').unique(),
  razorpayPlanId: text('razorpay_plan_id').notNull(),
  razorpayCustomerId: text('razorpay_customer_id'),
  
  // Subscription details
  plan: text('plan').notNull(), // pro, elite
  status: text('status').notNull().default('created'), // created, active, paused, cancelled
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  
  // Pricing
  amount: integer('amount').notNull(), // in cents
  currency: text('currency').notNull().default('USD'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('subscription_user_id_idx').on(table.userId),
  razorpayIdIdx: index('razorpay_subscription_id_idx').on(table.razorpaySubscriptionId),
}));

// Transactions table (for tracking all payments)
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  
  // Razorpay details
  razorpayPaymentId: text('razorpay_payment_id').unique(),
  razorpayOrderId: text('razorpay_order_id'),
  
  // Transaction info
  type: text('type').notNull(), // subscription, credit_purchase, affiliate_payout
  amount: integer('amount').notNull(),
  currency: text('currency').notNull().default('USD'),
  status: text('status').notNull(), // pending, success, failed, refunded
  
  // Metadata
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('transaction_user_id_idx').on(table.userId),
  typeIdx: index('transaction_type_idx').on(table.type),
}));

// Credit history table
export const creditHistory = pgTable('credit_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Credit details
  amount: integer('amount').notNull(), // Positive for addition, negative for deduction
  balance: integer('balance').notNull(), // Balance after this transaction
  type: text('type').notNull(), // purchase, subscription_renewal, generation, refund, bonus
  
  // Related to generation
  generationType: text('generation_type'), // video, audio, lipsync, music
  artifactId: uuid('artifact_id').references(() => artifacts.id),
  
  description: text('description'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('credit_history_user_id_idx').on(table.userId),
  createdAtIdx: index('credit_history_created_at_idx').on(table.createdAt),
}));

// Affiliates table (for tracking referral performance)
export const affiliates = pgTable('affiliates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  
  // Stats
  totalReferrals: integer('total_referrals').notNull().default(0),
  activeReferrals: integer('active_referrals').notNull().default(0), // Currently paying users
  totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }).notNull().default('0.00'),
  pendingPayout: decimal('pending_payout', { precision: 10, scale: 2 }).notNull().default('0.00'),
  
  // Payout info
  payoutMethod: text('payout_method'), // paypal, bank_transfer, upi
  payoutDetails: jsonb('payout_details'), // Encrypted payout information
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('affiliate_user_id_idx').on(table.userId),
}));

// Affiliate commissions table
export const affiliateCommissions = pgTable('affiliate_commissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  affiliateId: uuid('affiliate_id').notNull().references(() => affiliates.id, { onDelete: 'cascade' }),
  referredUserId: uuid('referred_user_id').notNull().references(() => users.id),
  transactionId: uuid('transaction_id').notNull().references(() => transactions.id),
  
  // Commission details
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  rate: decimal('rate', { precision: 5, scale: 4 }).notNull(), // e.g., 0.20 for 20%
  
  // Payout status
  status: text('status').notNull().default('pending'), // pending, paid, cancelled
  paidAt: timestamp('paid_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  affiliateIdIdx: index('commission_affiliate_id_idx').on(table.affiliateId),
  statusIdx: index('commission_status_idx').on(table.status),
}));

// Artifacts table (generated content)
export const artifacts = pgTable('artifacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Artifact details
  type: text('type').notNull(), // video, audio, lipsync, music, voiceover
  model: text('model').notNull(), // wan21, f5tts, sadtalker, etc.
  prompt: text('prompt').notNull(),
  
  // Generation settings
  settings: jsonb('settings'),
  
  // Output
  outputUrl: text('output_url'),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'), // in seconds
  fileSize: integer('file_size'), // in bytes
  
  // Processing
  status: text('status').notNull().default('queued'), // queued, processing, completed, failed
  errorMessage: text('error_message'),
  creditsCost: integer('credits_cost').notNull(),
  
  // Metadata
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}, (table) => ({
  userIdIdx: index('artifact_user_id_idx').on(table.userId),
  statusIdx: index('artifact_status_idx').on(table.status),
  createdAtIdx: index('artifact_created_at_idx').on(table.createdAt),
}));

// API Keys table (for programmatic access - Enterprise tier)
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  name: text('name').notNull(),
  key: text('key').notNull().unique(), // Hashed API key
  prefix: text('prefix').notNull(), // First 8 chars for display
  
  // Permissions
  scopes: jsonb('scopes').notNull(), // ['generate:video', 'generate:audio', etc.]
  
  // Rate limiting
  rateLimit: integer('rate_limit').default(100), // requests per hour
  
  isActive: boolean('is_active').default(true),
  lastUsedAt: timestamp('last_used_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  userIdIdx: index('api_key_user_id_idx').on(table.userId),
  keyIdx: index('api_key_key_idx').on(table.key),
}));

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  subscriptions: many(subscriptions),
  transactions: many(transactions),
  creditHistory: many(creditHistory),
  artifacts: many(artifacts),
  affiliate: one(affiliates, {
    fields: [users.id],
    references: [affiliates.userId],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const affiliatesRelations = relations(affiliates, ({ one, many }) => ({
  user: one(users, {
    fields: [affiliates.userId],
    references: [users.id],
  }),
  commissions: many(affiliateCommissions),
}));

export const artifactsRelations = relations(artifacts, ({ one }) => ({
  user: one(users, {
    fields: [artifacts.userId],
    references: [users.id],
  }),
}));
