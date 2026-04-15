import { db } from "../db";
import { feed } from "../db/schema";

/* CREATE POST */
export async function criarPost(usuario_id: string, tipo: string) {
  const createdAt = new Date().toISOString();

  await db.insert(feed).values({
    usuario_id,
    tipo,
    createdAt,
  });

  return { usuario_id, tipo };
}

/* GET FEED */
export function listarFeed() {
  return db.select().from(feed).all();
}
