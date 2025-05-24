CREATE TABLE "YUM_purchased_recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	"purchase_date" timestamp with time zone DEFAULT now() NOT NULL,
	"price_paid" numeric NOT NULL,
	"purchase_details" jsonb
);
--> statement-breakpoint
CREATE TABLE "YUM_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"auth_user_id" text,
	"name" text,
	"balance" numeric DEFAULT '0' NOT NULL,
	CONSTRAINT "YUM_users_auth_user_id_unique" UNIQUE("auth_user_id")
);
--> statement-breakpoint
ALTER TABLE "YUM_purchased_recipes" ADD CONSTRAINT "YUM_purchased_recipes_user_id_YUM_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."YUM_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "YUM_purchased_recipes" ADD CONSTRAINT "YUM_purchased_recipes_recipe_id_YUM_exclusive_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."YUM_exclusive_recipes"("id") ON DELETE no action ON UPDATE no action;