import { sql } from "drizzle-orm";
import { pgTable, uuid, text, integer, date, timestamp, numeric, unique } from "drizzle-orm/pg-core";

export const movies = pgTable("movies", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  rating: text("rating"),
  releaseDate: date("release_date"),
});


export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
});

export const screenings = pgTable("screenings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  movieId: uuid("movie_id").notNull(),
  roomId: uuid("room_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  price: numeric("price", { precision: 6, scale: 2 }).notNull(),
}, (table) => ({
  uniqueScreening: unique().on(table.movieId, table.roomId, table.startTime)
}));
