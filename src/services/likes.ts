import { likes } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";

export async function likePost(db: DB, feed_id: string, usuario_id: string) {
  if (!feed_id || !usuario_id) return { error: "Dados inválidos" };

  return db.insert(likes).values({
    id: randomUUID(),
    feed_id,
    usuario_id,
  }).run();
}

export function listarLikes(db: DB, feed_id: string) {
  if (!feed_id) return [];

  return db
    .select()
    .from(likes)
    .where(eq(likes.feed_id, feed_id))
    .all();
}

export async function removerLike(db: DB, feed_id: string, usuario_id: string) {
  if (!feed_id || !usuario_id) return { error: "Dados inválidos" };

  return db
    .delete(likes)
    .where(
      and(
        eq(likes.feed_id, feed_id),
        eq(likes.usuario_id, usuario_id)
      )
    )
    .run();
}
