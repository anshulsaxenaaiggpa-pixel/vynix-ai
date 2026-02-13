# Vynix AI - Database Setup Guide

## Quick Reference

### Database Status: ✅ READY

All database tables have been successfully created and are ready for use.

### Connection String
```
DATABASE_URL="postgresql://postgres:Supabase2026@db.ycfoinhepvffichdyzqy.supabase.co:5432/postgres"
```

## Helper Scripts

Run these scripts from the project root:

```bash
# Verify database connection and list tables
node verify-db.mjs

# Apply migrations (if needed in the future)
node apply-migration.mjs

# Open Drizzle Studio (visual database browser)
npx drizzle-kit studio
```

## Database Tables (8 total)

1. **users** - User accounts, authentication, credits
2. **subscriptions** - Razorpay subscription management  
3. **transactions** - Payment history
4. **credit_history** - Credit usage tracking
5. **affiliates** - Affiliate program data
6. **affiliate_commissions** - Referral commissions
7. **artifacts** - Generated content (video/audio)
8. **api_keys** - API access management

## Future Schema Changes

When you modify `db/schema.ts`:

1. Generate migration: `npx drizzle-kit generate`
2. Apply migration: `node apply-migration.mjs`
3. Verify: `node verify-db.mjs`

## Supabase Dashboard

Access your database at: https://supabase.com/dashboard/project/ycfoinhepvffichdyzqy

- View tables in Table Editor
- Run SQL queries in SQL Editor
- Monitor database performance
- Manage authentication settings

---

**Note**: The `NEXT_PUBLIC_SUPABASE_URL` and API keys in `.env.local` are still placeholders. Update them if you plan to use Supabase Auth features.
