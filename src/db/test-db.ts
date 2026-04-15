import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database(":memory:"); // banco isolado para testes

export const testDb = drizzle(sqlite);
