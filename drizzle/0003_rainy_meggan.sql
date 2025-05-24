CREATE TABLE "YUM_user_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"date_awarded" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "YUM_user_rewards" ADD CONSTRAINT "YUM_user_rewards_user_id_YUM_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."YUM_users"("id") ON DELETE no action ON UPDATE no action;