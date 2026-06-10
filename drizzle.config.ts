import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  dialect: "mysql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  introspect: {
    casing: "preserve",
  },
  schemaFilter: ["_timescaledb_internal", "_timescaledb_catalog", "_timescaledb_config", "_timescaledb_cache", "public" ],
});