import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { movies, rooms, screenings } from "./schema.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema: { movies, rooms, screenings } });