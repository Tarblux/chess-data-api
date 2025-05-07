import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Parse the database URL
const dbUrl = new URL(process.env.DATABASE_URL);

export default {
  schema: './app/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '5432'),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1), // Remove leading slash
    ssl: true,
  },
} satisfies Config; 