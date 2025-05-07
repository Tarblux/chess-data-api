import { pgTable, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

// Chess profile table
export const chessProfile = pgTable('chess_profile', {
  id: text('id').primaryKey(), // chess.com username
  username: text('username').notNull(),
  name: text('name'),
  title: text('title'),
  country: text('country'),
  location: text('location'),
  bio: text('bio'),
  avatar: text('avatar'),
  lastUpdated: timestamp('last_updated').defaultNow(),
  rawData: jsonb('raw_data'), // Store the complete API response
});

// Chess games table
export const chessGames = pgTable('chess_games', {
  id: text('id').primaryKey(), // chess.com game ID
  playerId: text('player_id').references(() => chessProfile.id),
  opponent: text('opponent'),
  result: text('result'),
  timeControl: text('time_control'),
  gameType: text('game_type'),
  playedAt: timestamp('played_at'),
  pgn: text('pgn'),
  rawData: jsonb('raw_data'),
});

// Chess stats table
export const chessStats = pgTable('chess_stats', {
  id: text('id').primaryKey(),
  playerId: text('player_id').references(() => chessProfile.id),
  gameType: text('game_type'),
  rating: integer('rating'),
  wins: integer('wins'),
  losses: integer('losses'),
  draws: integer('draws'),
  lastUpdated: timestamp('last_updated').defaultNow(),
  rawData: jsonb('raw_data'),
}); 