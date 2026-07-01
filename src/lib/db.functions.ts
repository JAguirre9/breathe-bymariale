import { createServerFn } from "@tanstack/react-start";
import { sql } from "./db.server";
import bcrypt from "bcryptjs";

export const pingDb = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await sql`select now() as now`;
  return { now: rows[0]?.now as string };
});

export const signUpUserFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data;
    if (!data || !data.email || !data.password)
      return { success: false, errorCode: "MISSING_FIELDS" };

    try {
      // 10 rounds ≈ industry standard, ~4× faster than 12 with equivalent practical strength.
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Single round-trip: rely on the unique index instead of a pre-flight SELECT.
      const rows = await sql`
        INSERT INTO "Usuario" ("nombre", "email", "password")
        VALUES (${data.name || null}, ${data.email}, ${hashedPassword})
        ON CONFLICT ("email") DO NOTHING
        RETURNING "id"
      `;

      if (rows.length === 0)
        return { success: false, errorCode: "EMAIL_ALREADY_EXISTS" };

      return { success: true, userId: rows[0].id };
    } catch (error: any) {
      return { success: false, errorCode: "SERVER_ERROR", errorMessage: error.message };
    }
  });

export const logInUserFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data;
    if (!data || !data.email || !data.password) 
      return { success: false, errorCode: "MISSING_FIELDS" };

    try {
      const [user] = await sql`
        SELECT "id", "nombre", "email", "password" 
        FROM "Usuario" WHERE "email" = ${data.email}
      `;

      if (!user) 
        return { success: false, errorCode: "INVALID_CREDENTIALS" };

      // Compare hashed password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      
      if (!isValidPassword) 
        return { success: false, errorCode: "INVALID_CREDENTIALS" };

      return { 
        success: true, 
        user: { 
          id: user.id, 
          name: user.nombre, 
          email: user.email 
        } 
      };
    } catch (error: any) {
      return { success: false, errorCode: "SERVER_ERROR", errorMessage: error.message };
    }
  });

export const submitIntakeFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const d = ctx.data;
    try {
      await sql`
        INSERT INTO "IntakeApplication" 
          ("userId", "professional", "preferredName", "age", "feelings", "priorSessions", "contactMethod")
        VALUES 
          (${d.userId}, 'Mariale', ${d.preferredName}, ${Number(d.age)}, ${d.feelings}, ${d.priorSessions}, ${d.contactMethod})
      `;
      return { success: true };
    } catch (e: any) {
      console.error("Intake Error:", e.message);
      return { success: false, errorMessage: e.message };
    }
  });