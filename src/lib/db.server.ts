import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __neonSql: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = globalThis.__neonSql ?? postgres(connectionString, { ssl: "require" });
if (process.env.NODE_ENV !== "production") globalThis.__neonSql = sql;
