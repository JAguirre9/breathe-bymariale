import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __neonSql: ReturnType<typeof postgres> | undefined;
}

let connectionString = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  connectionString = "postgresql://tu_usuario:tu_password@un-host-de-neon.postgres.neon.tech/neondb?sslmode=require";
}

export const sql = globalThis.__neonSql ?? postgres(connectionString, { ssl: "require" });

if (process.env.NODE_ENV !== "production") {
  globalThis.__neonSql = sql;
}