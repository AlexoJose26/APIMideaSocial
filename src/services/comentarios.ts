import { comentarios } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";

export async function criarComentario(
  db: DB,
  feed_id: string,
  usuario_id: string,
  texto: string
) {
  if (!feed_id || !usuario_id || !texto) {
    return { error: "Dados inválidos" };
  }

  return db.insert(comentarios).values({
    id: randomUUID(),
    feed_id,
    usuario_id,
    texto,
    createdAt: new Date().toISOString(),
  }).run();
}

export function listarComentarios(db: DB, feed_id: string) {
  if (!feed_id) return [];

  return db
    .select()
    .from(comentarios)
    .where(eq(comentarios.feed_id, feed_id))
    .all();
}

export async function deletarComentario(db: DB, id: string) {
  if (!id) return { error: "ID inválido" };

  return db.delete(comentarios).where(eq(comentarios.id, id)).run();
}
