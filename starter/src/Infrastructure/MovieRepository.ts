// Implémenter ici le repository `MovieRepository`.
import { pool } from "./DB.js";
import { Movie } from "../Domain/Movie.js";

export const MovieRepository = {
  async list(): Promise<Movie[]> {
    const result = await pool.query(`
      select
        id,
        title,
        description,
        duration_minutes as "durationMinutes",
        rating,
        release_date::text as "releaseDate"
      from movies
      order by id asc
    `);

    return result.rows;
  },
};

