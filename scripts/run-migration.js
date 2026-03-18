import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const sql = neon(process.env.DATABASE_URL);
const migration = readFileSync(new URL("./001-create-tables.sql", import.meta.url), "utf-8");

const statements = migration
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  await sql(stmt);
  console.log("Executed:", stmt.slice(0, 60) + "...");
}

console.log("Migration complete!");
