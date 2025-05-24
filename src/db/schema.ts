import { pgTable, serial, jsonb, text } from 'drizzle-orm/pg-core';

export const recipes = pgTable('YUM_recipes', {
  id: serial('id').primaryKey(),
  data: jsonb('data'),
  // Adding a name field as it's very common for recipes and will be useful.
  // We can store the full recipe object in 'data' and quick access fields like 'name' separately.
  name: text('name'), 
});

