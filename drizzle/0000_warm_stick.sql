CREATE TABLE "chess_games" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text,
	"opponent" text,
	"result" text,
	"time_control" text,
	"game_type" text,
	"played_at" timestamp,
	"pgn" text,
	"raw_data" jsonb
);
--> statement-breakpoint
CREATE TABLE "chess_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text,
	"title" text,
	"country" text,
	"location" text,
	"bio" text,
	"avatar" text,
	"last_updated" timestamp DEFAULT now(),
	"raw_data" jsonb
);
--> statement-breakpoint
CREATE TABLE "chess_stats" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text,
	"game_type" text,
	"rating" integer,
	"wins" integer,
	"losses" integer,
	"draws" integer,
	"last_updated" timestamp DEFAULT now(),
	"raw_data" jsonb
);
--> statement-breakpoint
ALTER TABLE "chess_games" ADD CONSTRAINT "chess_games_player_id_chess_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."chess_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chess_stats" ADD CONSTRAINT "chess_stats_player_id_chess_profile_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."chess_profile"("id") ON DELETE no action ON UPDATE no action;