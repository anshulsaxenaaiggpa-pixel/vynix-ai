import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

async function verifyDatabase() {
    console.log('🔌 Connecting to Supabase database...\n');

    const sql = postgres(connectionString, { max: 1 });

    try {
        // Get all tables
        const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

        console.log('✅ Database connection successful!\n');
        console.log('📊 Tables in database:');
        tables.forEach(table => {
            console.log(`  ✓ ${table.table_name}`);
        });

        console.log(`\n📈 Total tables: ${tables.length}`);

        // Test a simple query
        const userCount = await sql`SELECT COUNT(*) as count FROM users`;
        console.log(`\n👥 Users in database: ${userCount[0].count}`);

        console.log('\n✅ Database is ready to use!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

verifyDatabase();
