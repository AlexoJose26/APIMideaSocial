import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import type { AppDb } from "../db";
import {
  feed,
  usuarios,
} from "../db/schema";

export async function criarPost(
  dbInstance: AppDb,
  usuario_id: string,
  tipo: string,
) {
  if (!usuario_id || !tipo.trim()) {
    throw new Error("Dados inválidos.");
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

  const [novoPost] = await dbInstance
    .insert(feed)
    .values({
      id: randomUUID(),
      usuario_id,
      tipo: tipo.trim(),
      createdAt: new Date(),
    })
    .returning();

  if (!novoPost) {
    throw new Error(
      "Não foi possível criar a publicação.",
    );
  }

  return novoPost;
}

export async function listarFeed(
  dbInstance: AppDb,
) {
  return await dbInstance
    .select({
      id: feed.id,
      usuario_id: feed.usuario_id,
      tipo: feed.tipo,
      conteudo: feed.conteudo,
      createdAt: feed.createdAt,
      usuario: {
        id: usuarios.id,
        nome: usuarios.nome,
        foto_perfil: usuarios.foto_perfil,
      },
    })
    .from(feed)
    .leftJoin(
      usuarios,
      eq(feed.usuario_id, usuarios.id),
    )
    .orderBy(desc(feed.createdAt));
}
