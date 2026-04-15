import { db } from "../db";
import { criticas } from "../db/schema";
import { eq } from "drizzle-orm";

/* CREATE */
export async function criarCritica(usuario_id: string, livro_id: string, texto: string, nota: number) {
  const createdAt = new Date().toISOString();

  return db.insert(criticas).values({
    usuario_id,
    livro_id,
    texto,
    nota,
    createdAt,
  });
}

/* READ */
export function listarCriticas(livro_id?: string) {
  if (livro_id) {
    return db.select().from(criticas).where(eq(criticas.livro_id, livro_id)).all();
  }

  return db.select().from(criticas).all();
}

/* UPDATE */
export async function atualizarCritica(id: number, texto: string) {
  return db.update(criticas).set({ texto }).where(eq(criticas.id, id));
}

/* DELETE */
export async function deletarCritica(id: number) {
  return db.delete(criticas).where(eq(criticas.id, id));
}
