// Implémenter ici le repository `ScreeningRepository`.
import { pool } from "./DB.js";
import { Screening } from "../Domain/Screening.js";

export const ScreeningRepository = {
    async list(movieId: number): Promise<Screening[]> {
        const result = await pool.query(`
    select
        s.id,
        s.movie_id as "movieId",
        s.start_time::text as "startTime",
        s.price::float8 as "price",
        r.id as "roomId",
        r.name as "roomName",
        r.capacity as "roomCapacity"
    from screenings s
    join rooms r on r.id = s.room_id
    where s.movie_id = $1
    order by s.start_time asc;
    `
        , [movieId]);

        return result.rows;
    },
};
