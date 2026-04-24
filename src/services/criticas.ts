import { criticas, usuarios, livros } from "../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { DB } from "../db/types/db";


function num(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function str(v: any) {
  return v ? String(v) : "";
}

export async function criarCritica(
  db: DB,
  usuario_id: string,
  livro_id: string,
  texto: string,
  nota: number
) {
  const id = randomUUID();

  await db.insert(criticas).values({
    id,
    usuario_id: String(usuario_id),
    livro_id: String(livro_id),
    texto: String(texto),
    nota: Number(nota ?? 0),
    createdAt: new Date().toISOString(),
  }).run();

  const critica = await db
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


  return {
    id: critica!.id,
    texto: critica!.texto,
    nota: Number(critica!.nota),
    createdAt: critica!.createdAt,
    usuario: critica!.usuario,
    livro: critica!.livro,
  };
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

  return livro_id
    ? query.where(eq(criticas.livro_id, livro_id)).all()
    : query.all();
}
// UPDATE
export async function atualizarCritica(
  db: DB,
  id: string,
  texto: string,
  nota?: number
) {
  await db
    .update(criticas)
    .set({
      texto: str(texto),
      nota: num(nota),
    })
    .where(eq(criticas.id, id))
    .run();

  return { id, texto, nota };
}

// DELETE
export async function deletarCritica(db: DB, id: string) {
  await db.delete(criticas).where(eq(criticas.id, id)).run();
  return { success: true };
}
