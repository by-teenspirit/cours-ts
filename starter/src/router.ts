// Router HTTP (à implémenter)
//
// Objectif :
// - gérer les routes :
//   - GET /health
//   - GET /movies
//   - GET /movies/:id/screenings
// - envoyer les réponses JSON directement ici (sendJson / sendError)
//
// Conseil :
// - créer deux helpers locaux :
//   - sendJson(res, status, data)
//   - sendError(res, status, message)
// - parser `path` + `segments` avec :
//   - const [path] = (req.url ?? "/").split("?", 2)
//   - const segments = (path ?? "/").split("/").filter(Boolean)
import { IncomingMessage, ServerResponse } from "http";
import type { Pool } from "pg";
import { z } from "zod";
import type { MovieRepository } from "./Infrastructure/MovieRepository";
import type { ScreeningRepository } from "./Infrastructure/ScreeningRepository";

type RouterDeps = {
  pool: Pool;
  movies: typeof MovieRepository;
  screenings: typeof ScreeningRepository;
};

const MovieIdSchema = z.coerce.number().int().positive();

export async function router(
  req: IncomingMessage,
  res: ServerResponse,
  deps: RouterDeps
): Promise<void> {
  const { movies, screenings } = deps;

  const method = req.method ?? "GET";
  const [path] = (req.url ?? "/").split("?", 2);
  const segments = (path ?? "/").split("/").filter(Boolean);

  try {
    // GET /health
    if (method === "GET" && path === "/health") {
      return sendJson(res, 200, { ok: true });
    }

    // GET /movies
    if (method === "GET" && path === "/movies") {
      const items = await movies.list();
      return sendJson(res, 200, { ok: true, items });
    }

    // GET /movies/:id/screenings
    // GET /movies/:id/seances
    if (
      method === "GET" &&
      segments.length === 3 &&
      segments[0] === "movies" &&
      (segments[2] === "screenings" || segments[2] === "seances")
    ) {
      const parsedMovieId = MovieIdSchema.safeParse(segments[1]);

      if (!parsedMovieId.success) {
        return sendError(res, 400, "Invalid movie id");
      }

      const movieId = parsedMovieId.data;

      const items = await screenings.list(movieId);

      return sendJson(res, 200, { ok: true, items });
    }

    // route inconnue
    return sendError(res, 404, "Not found");
  } catch {
    return sendError(res, 500, "Internal server error");
  }
}

function sendJson(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(data));
}

function sendError(res: ServerResponse, status: number, message: string): void {
  sendJson(res, status, { ok: false, error: message });
}