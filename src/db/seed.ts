import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import {
	recipes as recipeTableSchema,
	exclusiveRecipes as exclusiveRecipeTableSchema,
	userRewards as userRewardsTableSchema,
} from "./schema"; // Assuming your schema is in schema.ts
import { recipes as mockRecipes } from "../mocks/recieps"; // Path to your mock data
import { exclusiveRecipes as mockExclusiveRecipes } from "../mocks/exclusiveRecipes"; // Path to your mock exclusive recipe data
import { userRewards as mockUserRewards } from "../mocks/userRewards"; // Import mock user rewards

dotenv.config();

async function main() {
	const tableToSeed = process.argv[2]; // Get table name from CLI argument

	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		console.error("Error: DATABASE_URL is not set in .env file");
		process.exit(1);
	}

	console.log("Connecting to database...");
	const client = postgres(databaseUrl, { prepare: false });
	const db = drizzle(client);

	if (tableToSeed === "recipes" || !tableToSeed) {
		// Seed recipes if 'recipes' or no arg provided
		console.log("Seeding recipes...");
		for (const recipe of mockRecipes) {
			try {
				// The id from mock data is ignored as the DB id is serial.
				// We map title to name, and the whole object to data.
				const result = await db
					.insert(recipeTableSchema)
					.values({
						name: recipe.title, // Map title to name
						data: recipe, // Store the whole recipe object in data
					})
					.returning();
				console.log(
					`Inserted recipe: ${result[0]?.name} (ID: ${result[0]?.id})`,
				);
			} catch (error) {
				console.error(`Error inserting recipe ${recipe.title}:`, error);
			}
		}
		console.log("Finished seeding recipes.");
	}

	if (tableToSeed === "exclusiveRecipes" || !tableToSeed) {
		// Seed exclusive recipes if 'exclusiveRecipes' or no arg provided
		console.log("Seeding exclusive recipes...");
		for (const recipe of mockExclusiveRecipes) {
			try {
				const result = await db
					.insert(exclusiveRecipeTableSchema)
					.values({
						name: recipe.title,
						data: recipe.data, // Store the recipe details in data
						price: recipe.price,
					})
					.returning();
				console.log(
					`Inserted exclusive recipe: ${result[0]?.name} (ID: ${result[0]?.id}, Price: ${result[0]?.price})`,
				);
			} catch (error) {
				console.error(
					`Error inserting exclusive recipe ${recipe.title}:`,
					error,
				);
			}
		}
		console.log("Finished seeding exclusive recipes.");
	}

	// Seed user rewards if 'userRewards' or no arg provided
	if (tableToSeed === "userRewards" || !tableToSeed) {
		console.log("Seeding user rewards...");
		for (const reward of mockUserRewards) {
			try {
				const result = await db
					.insert(userRewardsTableSchema)
					.values({
						userId: reward.userId,
						title: reward.title,
						description: reward.description,
						imageUrl: reward.imageUrl,
						// dateAwarded will use the database default
					})
					.returning();
				console.log(
					`Inserted user reward: ${result[0]?.title} for user ID ${result[0]?.userId} (ID: ${result[0]?.id})`,
				);
			} catch (error) {
				console.error(
					`Error inserting user reward ${reward.title}:`,
					error,
				);
			}
		}
		console.log("Finished seeding user rewards.");
	}

	if (
		tableToSeed &&
		tableToSeed !== "recipes" &&
		tableToSeed !== "exclusiveRecipes" &&
		tableToSeed !== "userRewards"
	) {
		console.warn(`Unknown table to seed: ${tableToSeed}. No data seeded.`);
	}

	console.log("Finished seeding database operations.");
	await client.end();
	console.log("Database connection closed.");
}

main().catch((err) => {
	console.error("Unhandled error during seeding:", err);
	process.exit(1);
});
