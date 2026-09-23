import { randomUUID } from "node:crypto";

import {
  and,
  eq,
  gt,
  lt,
} from "drizzle-orm";

import type { DB } from "../../db/types/db";

import {
  sessoes,
  usuarios,
} from "../../db/schema";

const SESSION_DAYS = 7;

// ============================================================
// CRIAR SESSÃO
// ============================================================

export async function criarSessao(
  db: DB,
  usuarioId: string,
) {
  if (!usuarioId) {
    throw new Error(
      "ID do utilizador é obrigatório.",
    );
  }

  const token = randomUUID();

  const expiresAt = new Date(
    Date.now() +
      SESSION_DAYS *
        24 *
        60 *
        60 *
        1000,
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

  if (!sessao) {
    throw new Error(
      "Não foi possível criar a sessão.",
    );
  }

  return sessao;
}

// ============================================================
// OBTER SESSÃO PELO TOKEN
// ============================================================

export async function obterSessao(
  db: DB,
  token: string | undefined,
) {
  if (!token) {
    return null;
  }

  const tokenLimpo = token.trim();

  if (!tokenLimpo) {
    return null;
  }

  const resultado = await db
    .select({
      sessao: {
        id: sessoes.id,
        token: sessoes.token,
        usuario_id: sessoes.usuario_id,
        expiresAt: sessoes.expiresAt,
        createdAt: sessoes.createdAt,
      },

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
      eq(
        sessoes.usuario_id,
        usuarios.id,
      ),
    )
    .where(
      and(
        eq(
          sessoes.token,
          tokenLimpo,
        ),
        gt(
          sessoes.expiresAt,
          new Date(),
        ),
      ),
    )
    .limit(1);

  if (resultado.length === 0) {
    return null;
  }

  return resultado[0];
}

// ============================================================
// REMOVER SESSÃO / LOGOUT
// ============================================================

export async function removerSessao(
  db: DB,
  token: string | undefined,
) {
  if (!token) {
    return;
  }

  const tokenLimpo = token.trim();

  if (!tokenLimpo) {
    return;
  }

  await db
    .delete(sessoes)
    .where(
      eq(
        sessoes.token,
        tokenLimpo,
      ),
    );
}

// ============================================================
// LIMPAR SESSÕES EXPIRADAS
// ============================================================

export async function limparSessoesExpiradas(
  db: DB,
) {
  await db
    .delete(sessoes)
    .where(
      lt(
        sessoes.expiresAt,
        new Date(),
      ),
    );
}
