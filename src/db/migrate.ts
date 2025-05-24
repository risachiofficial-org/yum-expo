import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Error: DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  console.log('Connecting to database for migration...');
  // Disable prepare mode for migrations as it can cause issues with some DDL statements
  const migrationClient = postgres(databaseUrl, { max: 1, prepare: false }); 
  const db = drizzle(migrationClient);

  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations applied successfully.');
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  } finally {
    console.log('Closing migration connection.');
    await migrationClient.end();
  }
}

main().catch((err) => {
  console.error('Unhandled error during migration:', err);
  process.exit(1);
}); 