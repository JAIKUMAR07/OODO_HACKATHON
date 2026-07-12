import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prefer DIRECT_URL for migrations/pushes as it bypasses the transaction pooler
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});
