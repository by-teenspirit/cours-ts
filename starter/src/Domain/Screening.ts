// Définir ici le type `Screening` (Domain).
export type Screening = {
  id: string;
  movieId: string;
  startTime: Date;
  endTime: Date;
};