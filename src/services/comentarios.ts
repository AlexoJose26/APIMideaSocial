import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import type { AppDb } from "../db";
import { comentarios, usuarios } from "../db/schema";

export async function criarComentario(
  dbInstance: AppDb,
  feed_id: string,
  usuario_id: string,
  texto: string,
) {
  if (!feed_id || !usuario_id || !texto.trim()) {
    throw new Error("Dados inválidos.");
  }

  const [comentario] = await dbInstance
    .insert(comentarios)
    .values({
      id: randomUUID(),
      feed_id,
      usuario_id,
      texto: texto.trim(),
      createdAt: new Date(),
    })
    .returning();

  if (!comentario) {
    throw new Error("Não foi possível criar o comentário.");
  }

  return comentario;
}

export async function listarComentarios(
  dbInstance: AppDb,
  feed_id: string,
) {
  if (!feed_id) {
    return [];
  }

  return await dbInstance
    .select({
      id: comentarios.id,
      feed_id: comentarios.feed_id,
      usuario_id: comentarios.usuario_id,
      texto: comentarios.texto,
      createdAt: comentarios.createdAt,
      usuario: {
        id: usuarios.id,
        nome: usuarios.nome,
        foto_perfil: usuarios.foto_perfil,
      },
    })
    .from(comentarios)
    .leftJoin(
      usuarios,
      eq(comentarios.usuario_id, usuarios.id),
    )
    .where(eq(comentarios.feed_id, feed_id));
}

export async function deletarComentario(
  dbInstance: AppDb,
  id: string,
) {
  if (!id) {
    throw new Error("ID inválido.");
  }

  const resultado = await dbInstance
    .delete(comentarios)
    .where(eq(comentarios.id, id))
    .returning({
      id: comentarios.id,
    });

  if (resultado.length === 0) {
    throw new Error("Comentário não encontrado.");
  }

  const comentario = resultado[0];

  if (!comentario) {
    throw new Error("Comentário não encontrado.");
  }

  return {
    success: true,
    id: comentario.id,
  };
}
