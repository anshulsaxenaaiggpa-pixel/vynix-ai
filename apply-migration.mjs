import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL is not set in .env.local');
    process.exit(1);
}

async function applyMigration() {
    console.log('🔌 Connecting to Supabase database...');

    const sql = postgres(connectionString, { max: 1 });

    try {
        // Read the migration file
        const migrationPath = join(process.cwd(), 'drizzle', '0000_charming_praxagora.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf-8');

        console.log('📄 Applying migration...');

        // Execute the migration
        await sql.unsafe(migrationSQL);

        console.log('✅ Migration applied successfully!');
        console.log('✅ All database tables have been created.');
        console.log('\n📊 Created tables:');
        console.log('  - users');
        console.log('  - subscriptions');
        console.log('  - transactions');
        console.log('  - credit_history');
        console.log('  - affiliates');
        console.log('  - affiliate_commissions');
        console.log('  - artifacts');
        console.log('  - api_keys');

    } catch (error) {
        console.error('❌ Error applying migration:', error.message);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

applyMigration();
