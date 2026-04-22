import { livros } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";

export async function criarLivro(db: DB, titulo: string) {
  const id = randomUUID();

  await db.insert(livros).values({ id, titulo });

  return { id, titulo };
}

export function listarLivros(db: DB) {
  return db.select().from(livros).all();
}

export function buscarLivro(db: DB, id: string) {
  return db.select().from(livros).where(eq(livros.id, id)).get();
}

export async function atualizarLivro(db: DB, id: string, titulo: string) {
  return db.update(livros).set({ titulo }).where(eq(livros.id, id));
}

export async function deletarLivro(db: DB, id: string) {
  return db.delete(livros).where(eq(livros.id, id));
}
