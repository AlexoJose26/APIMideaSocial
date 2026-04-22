import { criticas, usuarios, livros } from "../db/schema";
import { eq } from "drizzle-orm";
import type { DB } from "../db/types/db";

export async function criarCritica(
  db: DB,
  usuario_id: string,
  livro_id: string,
  texto: string,
  nota: number
) {
  const createdAt = new Date().toISOString();

  return db.insert(criticas).values({
    usuario_id,
    livro_id,
    texto,
    nota,
    createdAt,
  });
}

export function listarCriticas(db: DB, livro_id?: string) {
  const query = db
    .select({
      id: criticas.id,
      texto: criticas.texto,
      nota: criticas.nota,
      createdAt: criticas.createdAt,
      usuario: usuarios.nome,
      livro: livros.titulo,
    })
    .from(criticas)
    .leftJoin(usuarios, eq(criticas.usuario_id, usuarios.id))
    .leftJoin(livros, eq(criticas.livro_id, livros.id));

  if (livro_id) {
    return query.where(eq(criticas.livro_id, livro_id)).all();
  }

  return query.all();
}

export async function atualizarCritica(db: DB, id: number, texto: string) {
  return db.update(criticas).set({ texto }).where(eq(criticas.id, id));
}

export async function deletarCritica(db: DB, id: number) {
  return db.delete(criticas).where(eq(criticas.id, id));
}
