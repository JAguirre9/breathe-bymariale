import { createServerFn } from "@tanstack/react-start";
import { sql } from "./db.server";

export const pingDb = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await sql`select now() as now`;
  return { now: rows[0]?.now as string };
});
