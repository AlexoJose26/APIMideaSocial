import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import type { AppDb } from "../db";
import {
  likes,
  usuarios,
  feed,
} from "../db/schema";

export async function likePost(
  dbInstance: AppDb,
  feed_id: string,
  usuario_id: string,
) {
  if (!feed_id || !usuario_id) {
    throw new Error("Dados inválidos.");
  }

  const [post] = await dbInstance
    .select({
      id: feed.id,
    })
    .from(feed)
    .where(eq(feed.id, feed_id))
    .limit(1);

  if (!post) {
    throw new Error("Publicação não encontrada.");
  }

  const [usuario] = await dbInstance
    .select({
      id: usuarios.id,
    })
    .from(usuarios)
    .where(eq(usuarios.id, usuario_id))
    .limit(1);

  if (!usuario) {
    throw new Error("Utilizador não encontrado.");
  }

  const [existente] = await dbInstance
    .select({
      id: likes.id,
    })
    .from(likes)
    .where(
      and(
        eq(likes.feed_id, feed_id),
        eq(likes.usuario_id, usuario_id),
      ),
    )
    .limit(1);

  if (existente) {
    return {
      success: true,
      liked: true,
      id: existente.id,
      message: "Publicação já estava curtida.",
    };
  }

  const [novaCurtida] = await dbInstance
    .insert(likes)
    .values({
      id: randomUUID(),
      feed_id,
      usuario_id,
      createdAt: new Date(),
    })
    .returning();

  if (!novaCurtida) {
    throw new Error(
      "Não foi possível registrar a curtida.",
    );
  }

  return {
    success: true,
    liked: true,
    data: novaCurtida,
  };
}

export async function listarLikes(
  dbInstance: AppDb,
  feed_id: string,
) {
  if (!feed_id) {
    return [];
  }

  return await dbInstance
    .select({
      id: likes.id,
      feed_id: likes.feed_id,
      usuario_id: likes.usuario_id,
      createdAt: likes.createdAt,
      usuario: {
        id: usuarios.id,
        nome: usuarios.nome,
        foto_perfil: usuarios.foto_perfil,
      },
    })
    .from(likes)
    .leftJoin(
      usuarios,
      eq(likes.usuario_id, usuarios.id),
    )
    .where(eq(likes.feed_id, feed_id));
}

export async function removerLike(
  dbInstance: AppDb,
  feed_id: string,
  usuario_id: string,
) {
  if (!feed_id || !usuario_id) {
    throw new Error("Dados inválidos.");
  }

  const resultado = await dbInstance
    .delete(likes)
    .where(
      and(
        eq(likes.feed_id, feed_id),
        eq(likes.usuario_id, usuario_id),
      ),
    )
    .returning({
      id: likes.id,
    });

  if (resultado.length === 0) {
    throw new Error("Curtida não encontrada.");
  }

  const like = resultado[0];

  if (!like) {
    throw new Error("Curtida não encontrada.");
  }

  return {
    success: true,
    liked: false,
    id: like.id,
  };
}
