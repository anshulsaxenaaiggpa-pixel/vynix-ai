import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './db/schema.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set in .env.local');
  process.exit(1);
}

async function pushSchema() {
  console.log('Connecting to database...');
  
  // Create postgres connection
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql, { schema });

  try {
    console.log('Database connection successful!');
    console.log('Schema is ready to use with Drizzle ORM.');
    console.log('\nNote: Use "npx drizzle-kit push" to sync schema changes to the database.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

pushSchema();
