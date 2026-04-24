import { criticas, usuarios, livros } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";

/**
 * CRIAR CRÍTICA
 */
export async function criarCritica(
  db: DB,
  usuario_id: string,
  livro_id: string,
  texto: string,
  nota: number
) {
  if (!usuario_id || !livro_id || !texto) {
    return { error: "Dados inválidos" };
  }

  const id = randomUUID();

  await db.insert(criticas).values({
    id,
    usuario_id,
    livro_id,
    texto,
    nota: nota ?? 0,
    createdAt: new Date().toISOString(),
  }).run();

  // retorna crítica completa já com joins
  return db
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
    .leftJoin(livros, eq(criticas.livro_id, livros.id))
    .where(eq(criticas.id, id))
    .get();
}

/**
 * LISTAR CRÍTICAS
 */
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

/**
 * ATUALIZAR CRÍTICA
 */
export async function atualizarCritica(
  db: DB,
  id: string,
  texto: string,
  nota?: number
) {
  if (!id || !texto) {
    return { error: "Dados inválidos" };
  }

  await db
    .update(criticas)
    .set({
      texto,
      nota: nota ?? 0,
    })
    .where(eq(criticas.id, id))
    .run();

  return {
    id,
    texto,
    nota: nota ?? 0,
  };
}


export async function deletarCritica(db: DB, id: string) {
  if (!id) {
    return { error: "ID inválido" };
  }

  await db.delete(criticas).where(eq(criticas.id, id)).run();

  return { success: true };
}
