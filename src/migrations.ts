import { sql } from "drizzle-orm";
import { db } from "./db";

export async function runMigrations() {
  try {
    await db.execute(sql`SELECT 1`);

    console.log(
      "PostgreSQL conectado. As migrations são geridas pelo Drizzle Kit.",
    );
  } catch (error) {
    console.error(
      "Erro ao verificar a conexão com PostgreSQL:",
      error,
    );

    throw error;
  }
}
