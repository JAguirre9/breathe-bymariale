import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Aquí envolvemos la URL dentro de datasource tal como lo pide el error
  datasource: {
    url: process.env.DATABASE_URL,
  },
});