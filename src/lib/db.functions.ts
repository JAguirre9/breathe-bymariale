import { createServerFn } from "@tanstack/react-start";
import { sql } from "./db.server";

export const pingDb = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await sql`select now() as now`;
  return { now: rows[0]?.now as string };
});

export const signUpUserFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data;
    if (!data || !data.email || !data.password) return { success: false, errorCode: "MISSING_FIELDS" };
    try {
      const existingUsers = await sql`SELECT "id" FROM "Usuario" WHERE "email" = ${data.email}`;
      if (existingUsers.length > 0) return { success: false, errorCode: "EMAIL_ALREADY_EXISTS" };
      const [newUser] = await sql`INSERT INTO "Usuario" ("nombre", "email", "password") VALUES (${data.name || null}, ${data.email}, ${data.password}) RETURNING "id"`;
      return { success: true, userId: newUser.id };
    } catch (error: any) {
      return { success: false, errorCode: "SERVER_ERROR", errorMessage: error.message };
    }
  });

export const logInUserFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data;
    if (!data || !data.email || !data.password) return { success: false, errorCode: "MISSING_FIELDS" };
    try {
      const [user] = await sql`SELECT "id", "nombre", "email", "password" FROM "Usuario" WHERE "email" = ${data.email}`;
      if (!user || user.password !== data.password) return { success: false, errorCode: "INVALID_CREDENTIALS" };
      return { success: true, user: { id: user.id, name: user.nombre, email: user.email } };
    } catch (error: any) {
      return { success: false, errorCode: "SERVER_ERROR", errorMessage: error.message };
    }
  });

export const submitIntakeFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const d = ctx.data;
    try {
      await sql`
        INSERT INTO "IntakeApplication" ("userId", "professional", "preferredName", "age", "feelings", "priorSessions", "contactMethod")
        VALUES (${d.userId}, 'Mariale', ${d.preferredName}, ${Number(d.age)}, ${d.feelings}, ${d.priorSessions}, ${d.contactMethod})
        ON CONFLICT ("userId") 
        DO UPDATE SET 
          "preferredName" = EXCLUDED."preferredName",
          "age" = EXCLUDED."age",
          "feelings" = EXCLUDED."feelings",
          "priorSessions" = EXCLUDED."priorSessions",
          "contactMethod" = EXCLUDED."contactMethod";
      `;
      return { success: true };
    } catch (e: any) {
      return { success: false, errorMessage: e.message };
    }
  });