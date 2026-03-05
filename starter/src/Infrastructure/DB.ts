// Créer ici la connexion PostgreSQL (`pg.Pool`) en lisant `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`.
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const result = await pool.query<{ now: string }>("select now() as now");
console.log(result.rows[0]?.now);