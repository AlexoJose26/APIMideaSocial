import { randomUUID } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";

import type { DB } from "../../db/types/db";
import { sessoes, usuarios } from "../../db/schema";

const SESSION_DAYS = 7;

export async function criarSessao(
  db: DB,
  usuarioId: string,
) {
  const token = randomUUID();

  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  );

  const [sessao] = await db
    .insert(sessoes)
    .values({
      id: randomUUID(),
      token,
      usuario_id: usuarioId,
      expiresAt,
    })
    .returning({
      id: sessoes.id,
      token: sessoes.token,
      usuario_id: sessoes.usuario_id,
      expiresAt: sessoes.expiresAt,
    });

  return sessao;
}

export async function obterSessao(
  db: DB,
  token: string | undefined,
) {
  if (!token) {
    return null;
  }

  const resultado = await db
    .select({
      sessao: sessoes,
      usuario: {
        id: usuarios.id,
        nome: usuarios.nome,
        foto_perfil: usuarios.foto_perfil,
        createdAt: usuarios.createdAt,
      },
    })
    .from(sessoes)
    .innerJoin(
      usuarios,
      eq(sessoes.usuario_id, usuarios.id),
    )
    .where(
      and(
        eq(sessoes.token, token),
        gt(sessoes.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (resultado.length === 0) {
    return null;
  }

  return resultado[0];
}

export async function removerSessao(
  db: DB,
  token: string | undefined,
) {
  if (!token) {
    return;
  }

  await db
    .delete(sessoes)
    .where(eq(sessoes.token, token));
}

export async function limparSessoesExpiradas(
  db: DB,
) {
  await db
    .delete(sessoes)
    .where(
      lt(sessoes.expiresAt, new Date()),
    );
}
