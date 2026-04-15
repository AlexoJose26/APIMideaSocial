import { db } from "../db";
import { livros } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function criarLivro(titulo: string) {
  const id = randomUUID();

  await db.insert(livros).values({ id, titulo });

  return { id, titulo };
}

export function listarLivros() {
  return db.select().from(livros).all();
}

export function buscarLivro(id: string) {
  return db.select().from(livros).where(eq(livros.id, id)).get();
}

export async function atualizarLivro(id: string, titulo: string) {
  return db.update(livros).set({ titulo }).where(eq(livros.id, id));
}

export async function deletarLivro(id: string) {
  return db.delete(livros).where(eq(livros.id, id));
}
