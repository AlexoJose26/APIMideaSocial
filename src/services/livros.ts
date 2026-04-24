import { livros } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";

export async function criarLivro(db: DB, titulo: string, autor?: string) {
  if (!titulo) return { error: "Título obrigatório" };

  const id = randomUUID();

  await db.insert(livros).values({
    id,
    titulo,
    autor: autor || null,
  });

  return { id, titulo };
}

export function listarLivros(db: DB) {
  return db.select().from(livros).all() || [];
}

export function buscarLivro(db: DB, id: string) {
  if (!id) return null;

  return db.select().from(livros).where(eq(livros.id, id)).get() || null;
}

export async function atualizarLivro(db: DB, id: string, titulo: string) {
  if (!id || !titulo) return { error: "Dados inválidos" };

  return db.update(livros).set({ titulo }).where(eq(livros.id, id)).run();
}

export async function deletarLivro(db: DB, id: string) {
  if (!id) return { error: "ID inválido" };

  return db.delete(livros).where(eq(livros.id, id)).run();
}
