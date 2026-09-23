import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import type { AppDb } from "../db";
import {
  estantes,
  usuarios,
  livros,
} from "../db/schema";

const STATUS_VALIDOS = [
  "queroLer",
  "lendo",
  "lido",
] as const;

function validarStatus(status: string) {
  return STATUS_VALIDOS.includes(
    status as (typeof STATUS_VALIDOS)[number],
  );
}

export async function adicionarEstante(
  dbInstance: AppDb,
  usuario_id: string,
  livro_id: string,
  status: string,
) {
  if (
    !usuario_id ||
    !livro_id ||
    !status
  ) {
    throw new Error("Dados inválidos.");
  }

  if (!validarStatus(status)) {
    throw new Error(
      "Status inválido. Use queroLer, lendo ou lido.",
    );
  }

  const [livro] = await dbInstance
    .select({
      id: livros.id,
    })
    .from(livros)
    .where(eq(livros.id, livro_id))
    .limit(1);

  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  const [existente] = await dbInstance
    .select({
      id: estantes.id,
    })
    .from(estantes)
    .where(
      and(
        eq(estantes.usuario_id, usuario_id),
        eq(estantes.livro_id, livro_id),
      ),
    )
    .limit(1);

  if (existente) {
    const [atualizada] = await dbInstance
      .update(estantes)
      .set({
        status,
      })
      .where(eq(estantes.id, existente.id))
      .returning();

    if (!atualizada) {
      throw new Error(
        "Não foi possível atualizar a estante.",
      );
    }

    return atualizada;
  }

  const [novaEstante] = await dbInstance
    .insert(estantes)
    .values({
      id: randomUUID(),
      usuario_id,
      livro_id,
      status,
      createdAt: new Date(),
    })
    .returning();

  if (!novaEstante) {
    throw new Error(
      "Não foi possível adicionar o livro à estante.",
    );
  }

  return novaEstante;
}

export async function listarEstante(
  dbInstance: AppDb,
  usuario_id: string,
) {
  if (!usuario_id) {
    return [];
  }

  return await dbInstance
    .select({
      id: estantes.id,
      usuario_id: estantes.usuario_id,
      livro_id: estantes.livro_id,
      status: estantes.status,
      createdAt: estantes.createdAt,
      usuario: {
        id: usuarios.id,
        nome: usuarios.nome,
        foto_perfil: usuarios.foto_perfil,
      },
      livro: {
        id: livros.id,
        titulo: livros.titulo,
        autor: livros.autor,
        descricao: livros.descricao,
      },
    })
    .from(estantes)
    .leftJoin(
      usuarios,
      eq(estantes.usuario_id, usuarios.id),
    )
    .leftJoin(
      livros,
      eq(estantes.livro_id, livros.id),
    )
    .where(
      eq(estantes.usuario_id, usuario_id),
    );
}

export async function atualizarStatus(
  dbInstance: AppDb,
  id: string,
  usuarioId: string,
  status: string,
) {
  if (
    !id ||
    !usuarioId ||
    !status
  ) {
    throw new Error("Dados inválidos.");
  }

  if (!validarStatus(status)) {
    throw new Error(
      "Status inválido. Use queroLer, lendo ou lido.",
    );
  }

  const resultado = await dbInstance
    .update(estantes)
    .set({
      status,
    })
    .where(
      and(
        eq(estantes.id, id),
        eq(estantes.usuario_id, usuarioId),
      ),
    )
    .returning();

  if (resultado.length === 0) {
    throw new Error(
      "Estante não encontrada ou não pertence ao utilizador.",
    );
  }

  const estante = resultado[0];

  if (!estante) {
    throw new Error(
      "Estante não encontrada ou não pertence ao utilizador.",
    );
  }

  return estante;
}

export async function removerEstante(
  dbInstance: AppDb,
  id: string,
  usuarioId: string,
) {
  if (!id || !usuarioId) {
    throw new Error("Dados inválidos.");
  }

  const resultado = await dbInstance
    .delete(estantes)
    .where(
      and(
        eq(estantes.id, id),
        eq(estantes.usuario_id, usuarioId),
      ),
    )
    .returning({
      id: estantes.id,
      livro_id: estantes.livro_id,
    });

  if (resultado.length === 0) {
    throw new Error(
      "Estante não encontrada ou não pertence ao utilizador.",
    );
  }

  const estante = resultado[0];

  if (!estante) {
    throw new Error(
      "Estante não encontrada ou não pertence ao utilizador.",
    );
  }

  return estante;
}
