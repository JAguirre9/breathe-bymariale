import { neon, neonConfig } from "@neondatabase/serverless";

// Cache HTTP connections at the isolate level for lower per-request latency.
neonConfig.fetchConnectionCache = true;

declare global {
  // eslint-disable-next-line no-var
  var __neonSql: ReturnType<typeof neon> | undefined;
  // eslint-disable-next-line no-var
  var __neonSchemaReady: boolean | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  (import.meta as any).env?.DATABASE_URL ||
  "";

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Neon's HTTP driver: no TCP handshake per cold start, ideal for edge/Worker runtimes.
// The tagged-template API is call-compatible with the previous `postgres` client.
const _sql =
  globalThis.__neonSql ?? neon(connectionString, { fullResults: false });

// Cast to a tagged-template returning `any[]` so call sites keep their prior shape.
export const sql = _sql as unknown as (
  strings: TemplateStringsArray,
  ...values: any[]
) => Promise<any[]>;

// Fire-and-forget idempotent perf indexes; runs once per isolate.
if (!globalThis.__neonSchemaReady) {
  globalThis.__neonSchemaReady = true;
  (async () => {
    try {
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS "Usuario_email_key" ON "Usuario" ("email")`;
      await sql`CREATE INDEX IF NOT EXISTS "IntakeApplication_userId_idx" ON "IntakeApplication" ("userId")`;
      await sql`CREATE INDEX IF NOT EXISTS "IntakeApplication_creadoEn_idx" ON "IntakeApplication" ("creadoEn" DESC)`;
    } catch (e) {
      // Non-fatal: columns may not exist yet in some environments.
      console.warn("[db] index bootstrap skipped:", (e as Error).message);
    }
  })();
}
