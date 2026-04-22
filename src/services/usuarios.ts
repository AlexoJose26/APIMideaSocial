import { usuarios } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";

export async function criarUsuario(db: DB, nome: string, senha: string) {
  const id = randomUUID();

  await db.insert(usuarios).values({
    id,
    nome,
    senha,
  });

  return { id, nome };
}

export function listarUsuarios(db: DB) {
  return db.select().from(usuarios).all();
}

export function buscarUsuario(db: DB, id: string) {
  return db.select().from(usuarios).where(eq(usuarios.id, id)).get();
}

export async function atualizarUsuario(db: DB, id: string, nome: string) {
  return db.update(usuarios).set({ nome }).where(eq(usuarios.id, id));
}

export async function deletarUsuario(db: DB, id: string) {
  return db.delete(usuarios).where(eq(usuarios.id, id));
}
