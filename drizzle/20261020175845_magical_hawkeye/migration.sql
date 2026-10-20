CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"first_name" varchar(45) NOT NULL,
	"last_name" varchar(45),
	"email" varchar NOT NULL UNIQUE,
	"email_varified" boolean DEFAULT false NOT NULL,
	"password" varchar(70),
	"salt" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
