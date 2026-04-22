import { feed, usuarios } from "../db/schema";
import { eq } from "drizzle-orm";
import type { DB } from "../db/types/db";

export async function criarPost(
  db: DB,
  usuario_id: string,
  tipo: string
) {
  const createdAt = new Date().toISOString();

  await db.insert(feed).values({
    usuario_id,
    tipo,
    createdAt,
  });

  return { usuario_id, tipo };
}

export function listarFeed(db: DB) {
  return db
    .select({
      id: feed.id,
      tipo: feed.tipo,
      createdAt: feed.createdAt,
      usuario: usuarios.nome,
    })
    .from(feed)
    .leftJoin(usuarios, eq(feed.usuario_id, usuarios.id))
    .all();
}
