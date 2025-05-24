import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { recipes as recipeTableSchema } from './schema'; // Assuming your schema is in schema.ts
import { recipes as mockRecipes } from '../mocks/recieps'; // Path to your mock data

dotenv.config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Error: DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = postgres(databaseUrl, { prepare: false });
  const db = drizzle(client);

  console.log('Seeding recipes...');

  for (const recipe of mockRecipes) {
    try {
      // The id from mock data is ignored as the DB id is serial.
      // We map title to name, and the whole object to data.
      const result = await db.insert(recipeTableSchema).values({
        name: recipe.title, // Map title to name
        data: recipe,       // Store the whole recipe object in data
      }).returning();
      console.log(`Inserted recipe: ${result[0]?.name} (ID: ${result[0]?.id})`);
    } catch (error) {
      console.error(`Error inserting recipe ${recipe.title}:`, error);
    }
  }

  console.log('Finished seeding database.');
  await client.end();
  console.log('Database connection closed.');
}

main().catch((err) => {
  console.error('Unhandled error during seeding:', err);
  process.exit(1);
}); 