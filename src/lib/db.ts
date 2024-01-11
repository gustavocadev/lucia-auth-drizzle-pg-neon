import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DB_URL,
});

export const db = drizzle(pool);
