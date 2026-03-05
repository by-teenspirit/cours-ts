import { createServer } from "node:http";
import { pool } from "./Infrastructure/DB.js";
import { MovieRepository } from "./Infrastructure/MovieRepository.js";
import { ScreeningRepository } from "./Infrastructure/ScreeningRepository.js";
import { router } from "./router.js";

const PORT = Number(process.env.PORT ?? 3001);

const deps = {
  pool,
  movies: MovieRepository,
  screenings: ScreeningRepository,
};

const server = createServer(async (req, res) => {
  try {
    await router(req, res, deps);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Internal server error" }));
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});