import { estantes, usuarios, livros } from "../db/schema";
import { eq } from "drizzle-orm";
import type { DB } from "../db/types/db";

export async function adicionarEstante(
  db: DB,
  usuario_id: string,
  livro_id: string,
  status: string
) {
  const createdAt = new Date().toISOString();

  return db.insert(estantes).values({
    usuario_id,
    livro_id,
    status,
    createdAt,
  });
}

export function listarEstante(db: DB, usuario_id: string) {
  return db
    .select({
      id: estantes.id,
      status: estantes.status,
      createdAt: estantes.createdAt,
      usuario: usuarios.nome,
      livro: livros.titulo,
    })
    .from(estantes)
    .leftJoin(usuarios, eq(estantes.usuario_id, usuarios.id))
    .leftJoin(livros, eq(estantes.livro_id, livros.id))
    .where(eq(estantes.usuario_id, usuario_id))
    .all();
}

export async function atualizarStatus(db: DB, id: number, status: string) {
  return db.update(estantes).set({ status }).where(eq(estantes.id, id));
}

export async function removerEstante(db: DB, id: number) {
  return db.delete(estantes).where(eq(estantes.id, id));
}
