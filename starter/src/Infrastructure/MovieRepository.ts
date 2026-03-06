import { db } from "./drizzle.js";
import { movies } from "./schema.js";
import type { Movie } from "../Domain/Movie.js";

export const MovieRepository = {
  async list(): Promise<Movie[]> {
    return db.select().from(movies).orderBy(movies.id.asc);
  },

  async findById(id: number): Promise<Movie | null> {
    return db.select().from(movies).where(movies.id.eq(id)).get();
  },

  async create(movie: Partial<Movie>): Promise<Movie> {
    const [newMovie] = await db
      .insert(movies)
      .values({
        title: movie.title!,
        description: movie.description,
        durationMinutes: movie.durationMinutes!,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
      })
      .returning("*");
    return newMovie;
  },

  async update(id: number, data: Partial<Movie>): Promise<Movie | null> {
    const [updated] = await db
      .update(movies)
      .set(data)
      .where(movies.id.eq(id))
      .returning("*");
    return updated || null;
  },

  async delete(id: number): Promise<void> {
    await db.delete(movies).where(movies.id.eq(id));
  },
};