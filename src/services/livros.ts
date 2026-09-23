import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import type { AppDb } from "../db";
import { livros } from "../db/schema";

export async function criarLivro(
  dbInstance: AppDb,
  titulo: string,
  autor?: string,
) {
  if (!titulo.trim()) {
    throw new Error("Título obrigatório.");
  }

  const [novoLivro] = await dbInstance
    .insert(livros)
    .values({
      id: randomUUID(),
      titulo: titulo.trim(),
      autor: autor?.trim() || null,
      createdAt: new Date(),
    })
    .returning();

  if (!novoLivro) {
    throw new Error("Não foi possível criar o livro.");
  }

  return novoLivro;
}

export async function listarLivros(
  dbInstance: AppDb,
) {
  return await dbInstance
    .select()
    .from(livros)
    .orderBy(desc(livros.createdAt));
}

export async function buscarLivro(
  dbInstance: AppDb,
  id: string,
) {
  if (!id) {
    return null;
  }

  const [livro] = await dbInstance
    .select()
    .from(livros)
    .where(eq(livros.id, id))
    .limit(1);

  return livro ?? null;
}

export async function atualizarLivro(
  dbInstance: AppDb,
  id: string,
  titulo: string,
) {
  if (!id || !titulo.trim()) {
    throw new Error("Dados inválidos.");
  }

  const [livro] = await dbInstance
    .update(livros)
    .set({
      titulo: titulo.trim(),
    })
    .where(eq(livros.id, id))
    .returning();

  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  return livro;
}

export async function deletarLivro(
  dbInstance: AppDb,
  id: string,
) {
  if (!id) {
    throw new Error("ID inválido.");
  }

  const resultado = await dbInstance
    .delete(livros)
    .where(eq(livros.id, id))
    .returning({
      id: livros.id,
    });

  if (resultado.length === 0) {
    throw new Error("Livro não encontrado.");
  }

  const livro = resultado[0];

  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  return {
    success: true,
    id: livro.id,
  };
}
