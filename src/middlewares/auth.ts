import { Elysia } from "elysia";

import { db } from "../db";
import { obterSessao } from "../routes/auth/session";

export type UsuarioAutenticado = {
  id: string;
  nome: string;
  foto_perfil: string | null;
  createdAt: Date;
};

export const authMiddleware = new Elysia({
  name: "auth-middleware",
}).derive(
  {
    as: "global",
  },
  async ({ headers, set }) => {
    const authorization =
      headers.authorization;

    // ==========================================================
    // TOKEN NÃO ENVIADO
    // ==========================================================

    if (!authorization) {
      set.status = 401;

      return {
        usuario: null as UsuarioAutenticado | null,
      };
    }

    // ==========================================================
    // EXTRAIR TOKEN
    // ==========================================================

    const token =
      authorization.startsWith("Bearer ")
        ? authorization
            .slice(7)
            .trim()
        : authorization.trim();

    if (!token) {
      set.status = 401;

      return {
        usuario: null as UsuarioAutenticado | null,
      };
    }

    // ==========================================================
    // VALIDAR SESSÃO
    // ==========================================================

    try {
      const sessao = await obterSessao(
        db,
        token,
      );

      if (!sessao) {
        set.status = 401;

        return {
          usuario: null as UsuarioAutenticado | null,
        };
      }

      // ========================================================
      // UTILIZADOR AUTENTICADO
      // ========================================================

      return {
        usuario:
          sessao.usuario satisfies UsuarioAutenticado,
      };
    } catch (error) {
      console.error(
        "Erro ao validar sessão:",
        error,
      );

      set.status = 401;

      return {
        usuario: null as UsuarioAutenticado | null,
      };
    }
  },
);
