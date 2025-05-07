import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Configure neon to use WebSocket
neonConfig.webSocketConstructor = WebSocket;

// Create a single connection pool
const sql = neon(process.env.DATABASE_URL!);

// Create the database instance
export const db = drizzle(sql, { schema });

// Helper function to check database connection
export async function checkConnection() {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
} 