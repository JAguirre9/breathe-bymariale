import { createServerFn } from "@tanstack/react-start";
import { sql } from "./db.server"; 

export const registrarUsuarioFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data;

    try {
      const usuariosExistentes = await sql`
        SELECT id FROM "Usuario" WHERE email = ${data.email}
      `;

      if (usuariosExistentes.length > 0) {
        throw new Error("El correo ya está registrado.");
      }

      const [nuevoUsuario] = await sql`
        INSERT INTO "Usuario" (nombre, email, password)
        VALUES (${data.nombre || null}, ${data.email}, ${data.password})
        RETURNING id
      `;

      return { success: true, userId: nuevoUsuario.id };
    } catch (error: any) {
      throw new Error(error.message || "Error al registrar el usuario.");
    }
  });

export const iniciarSesionFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data;

    try {
      const [usuario] = await sql`
        SELECT id, nombre, email, password FROM "Usuario" WHERE email = ${data.email}
      `;

      if (!usuario || usuario.password !== data.password) {
        throw new Error("Credenciales incorrectas.");
      }

      return { success: true, usuario: { id: usuario.id, nombre: usuario.nombre } };
    } catch (error: any) {
      throw new Error(error.message || "Error al iniciar sesión.");
    }
  });