import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use pooler URL (port 6543) since the direct connection (port 5432) may be blocked
    url: env("DATABASE_URL"),
  },
});
