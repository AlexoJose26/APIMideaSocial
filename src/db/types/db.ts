import { drizzle } from "drizzle-orm/bun-sqlite";

export type DB = ReturnType<typeof drizzle>;
