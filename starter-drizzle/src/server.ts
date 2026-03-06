import { drizzle } from "drizzle-orm/node-postgres";
import { asc, count, eq, gte, and } from "drizzle-orm";
import { movies, screenings, rooms } from "./drizzle/schema";
import { pool } from "./db"
import { PgColumn } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

const validRoomId = randomUUID();
console.log(validRoomId);

export const db = drizzle(pool);

export async function listMovies() {
  const items = await db
    .select()
    .from(movies)
    .orderBy(asc(movies.id));

  return items;
}

listMovies().then(console.log)


export async function getMovieSchedule(movieId: string) {
  return db
    .select({
      movieId: movies.id,
      movieTitle: movies.title,
      screeningId: screenings.id,
      startTime: screenings.startTime,
      roomName: rooms.name,
    })
    .from(movies)
    .innerJoin(screenings, eq(screenings.movieId, movies.id))
    .innerJoin(rooms, eq(rooms.id, screenings.roomId))
    .where(eq(movies.id, movieId))
    .orderBy(asc(screenings.startTime));
}

getMovieSchedule("8c2d4f91-1a6b-4c3e-8f57-9d2a6b4e1c22").then(console.log)

export async function listMoviesWithCount() {
  return db
    .select({
      id: movies.id,
      title: movies.title,
      screeningsCount: count(screenings.id),
    })
    .from(movies)
    .leftJoin(screenings, eq(screenings.movieId, movies.id))
    .groupBy(movies.id, movies.title);
}

listMoviesWithCount().then(console.log)


export async function createScreening(input: {
  movieId: string;
  roomId: string;
  startTime: Date;
  price: string;
}) {
  const [movie] = await db.select({ id: movies.id }).from(movies).where(eq(movies.id, input.movieId));
  const [room] = await db.select({ id: rooms.id }).from(rooms).where(eq(rooms.id, input.roomId));
  if (!movie || !room) return null;

  // Check if screening already exists
  const existing = await db.select().from(screenings).where(and(
    eq(screenings.movieId, input.movieId),
    eq(screenings.roomId, input.roomId),
    eq(screenings.startTime, input.startTime)
  ));
  if (existing.length > 0) return existing[0];

  // on n'inclut pas l'id, Drizzle/PG va le générer
  const [created] = await db.insert(screenings).values({
    ...input,
    id: randomUUID()
  }).onConflictDoNothing().returning();
  return created;
}

await db.insert(rooms).values({
  id: "11fc564d-ebb6-4d33-a38d-7e431064b2b0", // UUID valide
  name: "Room B",
  capacity: 100
}).onConflictDoNothing();

await db.insert(rooms).values({
  id: "ae33fbf0-3bc9-4acf-b09a-8bb09d63b726",
  name: "Room A",
  capacity: 150
}).onConflictDoNothing();

createScreening({
  movieId: "8c2d4f91-1a6b-4c3e-8f57-9d2a6b4e1c22",
  roomId: "ae33fbf0-3bc9-4acf-b09a-8bb09d63b726",
  startTime: new Date("2024-07-01T20:00:00Z"),
  price: "12.50",
}).then(console.log);

export async function listUpcomingScreenings(movieId: string, from: Date) {
  return db
    .select()
    .from(screenings)
    .where(and(eq(screenings.movieId, movieId), gte(screenings.startTime, from)))
    .orderBy(asc(screenings.startTime));
}

listUpcomingScreenings("8c2d4f91-1a6b-4c3e-8f57-9d2a6b4e1c22", new Date()).then(console.log);   