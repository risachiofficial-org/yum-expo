CREATE TABLE "YUM_exclusive_recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" jsonb,
	"name" text,
	"price" numeric NOT NULL
);
