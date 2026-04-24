import { estantes, usuarios, livros } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";

export async function adicionarEstante(
  db: DB,
  usuario_id: string,
  livro_id: string,
  status: string
) {
  if (!usuario_id || !livro_id || !status) {
    return { error: "Dados inválidos" };
  }

  const id = randomUUID();

  return db.insert(estantes).values({
    id,
    usuario_id,
    livro_id,
    status,
    createdAt: new Date().toISOString(),
  }).run();
}

export function listarEstante(db: DB, usuario_id?: string) {
  const query = db
    .select({
      id: estantes.id,
      status: estantes.status,
      createdAt: estantes.createdAt,
      usuario: usuarios.nome,
      livro: livros.titulo,
    })
    .from(estantes)
    .leftJoin(usuarios, eq(estantes.usuario_id, usuarios.id))
    .leftJoin(livros, eq(estantes.livro_id, livros.id));

  if (usuario_id) {
    return query.where(eq(estantes.usuario_id, usuario_id)).all();
  }

  return query.all() || [];
}

export async function atualizarStatus(db: DB, id: string, status: string) {
  if (!id || !status) return { error: "Dados inválidos" };

  return db.update(estantes).set({ status }).where(eq(estantes.id, id)).run();
}

export async function removerEstante(db: DB, id: string) {
  if (!id) return { error: "ID inválido" };

  return db.delete(estantes).where(eq(estantes.id, id)).run();
}
