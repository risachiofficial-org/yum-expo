import {
	pgTable,
	serial,
	jsonb,
	text,
	numeric,
	integer,
	timestamp,
} from "drizzle-orm/pg-core";

export const recipes = pgTable("YUM_recipes", {
	id: serial("id").primaryKey(),
	data: jsonb("data"),
	// Adding a name field as it's very common for recipes and will be useful.
	// We can store the full recipe object in 'data' and quick access fields like 'name' separately.
	name: text("name"),
});

export const exclusiveRecipes = pgTable("YUM_exclusive_recipes", {
	id: serial("id").primaryKey(),
	data: jsonb("data"),
	name: text("name"),
	price: numeric("price").notNull(), // Price in YUM tokens
});

export const users = pgTable("YUM_users", {
	id: serial("id").primaryKey(),
	authUserId: text("auth_user_id").unique(), // To link with Supabase Auth or other auth provider
	name: text("name"),
	balance: numeric("balance").notNull().default("0"), // User's YUM token balance
});

export const purchasedRecipes = pgTable("YUM_purchased_recipes", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	recipeId: integer("recipe_id")
		.notNull()
		.references(() => exclusiveRecipes.id),
	purchaseDate: timestamp("purchase_date", { withTimezone: true })
		.notNull()
		.defaultNow(),
	pricePaid: numeric("price_paid").notNull(),
	purchaseDetails: jsonb("purchase_details"), // e.g., transaction ID, discounts applied
});

export const userRewards = pgTable("YUM_user_rewards", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	title: text("title").notNull(),
	description: text("description"),
	imageUrl: text("image_url"), // URL to the reward image (e.g., NFT image)
	dateAwarded: timestamp("date_awarded", { withTimezone: true })
		.notNull()
		.defaultNow(),
	// Add other relevant fields like reward_type, nft_contract_address, nft_token_id if needed later
});
