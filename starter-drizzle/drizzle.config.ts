import { defineConfig } from "drizzle-kit";

 export default defineConfig({
    dialect: "postgresql", // SGBD cible : PostgreSQL
    schema: "./src/drizzle/schema.ts", // Fichier TS qui décrit les tables
    out: "./drizzle", // Dossier de sortie des migrations SQL générées
    dbCredentials: {
      host: "postgres", // Hôte DB (nom du service Docker Compose)
      port: 5432, // Port PostgreSQL côté conteneur
      user: "postgres", // Utilisateur PostgreSQL
      password: "postgres", // Mot de passe PostgreSQL
      database: "db_sandbox", // Base de données ciblée
      ssl: false, // SSL désactivé (en local Docker)
    },
  });