import { db } from "../db";
import { estantes } from "../db/schema";
import { eq } from "drizzle-orm";

/* CREATE */
export async function adicionarEstante(usuario_id: string, livro_id: string, status: string) {
  const createdAt = new Date().toISOString();

  return db.insert(estantes).values({
    usuario_id,
    livro_id,
    status,
    createdAt,
  });
}

/* READ */
export function listarEstante(usuario_id: string) {
  return db.select().from(estantes).where(eq(estantes.usuario_id, usuario_id)).all();
}

/* UPDATE */
export async function atualizarStatus(id: number, status: string) {
  return db.update(estantes).set({ status }).where(eq(estantes.id, id));
}

/* DELETE */
export async function removerEstante(id: number) {
  return db.delete(estantes).where(eq(estantes.id, id));
}
