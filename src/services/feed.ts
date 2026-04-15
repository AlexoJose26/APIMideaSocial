import { db } from "../db";
import { feed } from "../db/schema";
import { randomUUID } from "crypto";

/* CREATE POST */
export async function criarPost(usuario_id: string, tipo: string) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await db.insert(feed).values({
    id,
    usuario_id,
    tipo,
    createdAt,
  });

  return { id, usuario_id, tipo };
}

/* GET FEED */
export function listarFeed() {
  return db.select().from(feed).all();
}
