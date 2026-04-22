import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";

export const sqlite = new Database("apimideasocial.db");
export const db = drizzle(sqlite);
