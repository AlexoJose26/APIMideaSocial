import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import type { AppDb } from "../db";
import {
  criticas,
  usuarios,
  livros,
} from "../db/schema";

export async function criarCritica(
  dbInstance: AppDb,
  usuario_id: string,
  livro_id: string,
  texto: string,
  nota: number,
) {
  if (
    !usuario_id ||
    !livro_id ||
    !texto.trim()
  ) {
    throw new Error("Dados inválidos.");
  }

  const notaNumerica = Number(nota);

  if (
    !Number.isFinite(notaNumerica) ||
    notaNumerica < 0 ||
    notaNumerica > 5
  ) {
    throw new Error("A nota deve estar entre 0 e 5.");
  }

  const id = randomUUID();

  const [novaCritica] = await dbInstance
    .insert(criticas)
    .values({
      id,
      usuario_id,
      livro_id,
      texto: texto.trim(),
      nota: notaNumerica,
      createdAt: new Date(),
    })
    .returning();

  if (!novaCritica) {
    throw new Error("Não foi possível criar a crítica.");
  }

  const [critica] = await dbInstance
    .select({
      id: criticas.id,
      usuario_id: criticas.usuario_id,
      livro_id: criticas.livro_id,
      texto: criticas.texto,
      nota: criticas.nota,
      createdAt: criticas.createdAt,
      usuario: {
        id: usuarios.id,
        nome: usuarios.nome,
        foto_perfil: usuarios.foto_perfil,
      },
      livro: {
        id: livros.id,
        titulo: livros.titulo,
        autor: livros.autor,
      },
    })
    .from(criticas)
    .leftJoin(
      usuarios,
      eq(criticas.usuario_id, usuarios.id),
    )
    .leftJoin(
      livros,
      eq(criticas.livro_id, livros.id),
    )
    .where(eq(criticas.id, novaCritica.id))
    .limit(1);

  return critica ?? novaCritica;
}

export async function listarCriticas(
  dbInstance: AppDb,
  livro_id?: string,
) {
  const query = dbInstance
    .select({
      id: criticas.id,
      usuario_id: criticas.usuario_id,
      livro_id: criticas.livro_id,
      texto: criticas.texto,
      nota: criticas.nota,
      createdAt: criticas.createdAt,
      usuario: {
        id: usuarios.id,
        nome: usuarios.nome,
        foto_perfil: usuarios.foto_perfil,
      },
      livro: {
        id: livros.id,
        titulo: livros.titulo,
        autor: livros.autor,
      },
    })
    .from(criticas)
    .leftJoin(
      usuarios,
      eq(criticas.usuario_id, usuarios.id),
    )
    .leftJoin(
      livros,
      eq(criticas.livro_id, livros.id),
    );

  if (livro_id) {
    return await query.where(
      eq(criticas.livro_id, livro_id),
    );
  }

  return await query;
}

export async function atualizarCritica(
  dbInstance: AppDb,
  id: string,
  texto: string,
  nota?: number,
) {
  if (!id || !texto.trim()) {
    throw new Error("Dados inválidos.");
  }

  const dados: {
    texto: string;
    nota?: number;
  } = {
    texto: texto.trim(),
  };

  if (nota !== undefined) {
    const notaNumerica = Number(nota);

    if (
      !Number.isFinite(notaNumerica) ||
      notaNumerica < 0 ||
      notaNumerica > 5
    ) {
      throw new Error("A nota deve estar entre 0 e 5.");
    }

    dados.nota = notaNumerica;
  }

  const [atualizada] = await dbInstance
    .update(criticas)
    .set(dados)
    .where(eq(criticas.id, id))
    .returning();

  if (!atualizada) {
    throw new Error("Crítica não encontrada.");
  }

  return atualizada;
}

export async function deletarCritica(
  dbInstance: AppDb,
  id: string,
) {
  if (!id) {
    throw new Error("ID inválido.");
  }

  const resultado = await dbInstance
    .delete(criticas)
    .where(eq(criticas.id, id))
    .returning({
      id: criticas.id,
    });

  if (resultado.length === 0) {
    throw new Error("Crítica não encontrada.");
  }

  const critica = resultado[0];

  if (!critica) {
    throw new Error("Crítica não encontrada.");
  }

  return {
    success: true,
    id: critica.id,
  };
}
