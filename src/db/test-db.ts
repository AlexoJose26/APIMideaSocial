import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { runMigrations } from "../migrations";

export function createTestDb() {
  const sqlite = new Database(":memory:");

  runMigrations(sqlite);

  return drizzle(sqlite);
}
