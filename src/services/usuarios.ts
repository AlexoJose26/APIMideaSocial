import { db } from "../db";
import { usuarios } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/* CREATE */
export async function criarUsuario(nome: string, senha: string) {
  const id = randomUUID();

  await db.insert(usuarios).values({
    id,
    nome,
    senha,
  });

  return { id, nome };
}

/* READ ALL */
export function listarUsuarios() {
  return db.select().from(usuarios).all();
}

/* READ ONE */
export function buscarUsuario(id: string) {
  return db.select().from(usuarios).where(eq(usuarios.id, id)).get();
}

/* UPDATE */
export async function atualizarUsuario(id: string, nome: string) {
  return db.update(usuarios).set({ nome }).where(eq(usuarios.id, id));
}

/* DELETE */
export async function deletarUsuario(id: string) {
  return db.delete(usuarios).where(eq(usuarios.id, id));
}
