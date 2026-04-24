import { feed, usuarios } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";

export async function criarPost(db: DB, usuario_id: string, tipo: string) {
  if (!usuario_id || !tipo) return { error: "Dados inválidos" };

  const id = randomUUID();

  return db.insert(feed).values({
    id,
    usuario_id,
    tipo,
    createdAt: new Date().toISOString(),
  }).run();
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
    .all() || [];
}
