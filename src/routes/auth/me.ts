import { Elysia } from "elysia";

import { db } from "../../db";
import { obterSessao } from "./session";

export const meRoute = new Elysia()
  .get("/me", async ({ headers, set }) => {
    const authorization =
      headers.authorization;

    if (!authorization) {
      set.status = 401;

      return {
        success: false,
        message: "Token não fornecido.",
      };
    }

    const token = authorization.startsWith("Bearer ")
      ? authorization.substring(7).trim()
      : authorization.trim();

    if (!token) {
      set.status = 401;

      return {
        success: false,
        message: "Token inválido.",
      };
    }

    const sessao = await obterSessao(
      db,
      token,
    );

    if (!sessao) {
      set.status = 401;

      return {
        success: false,
        message: "Sessão inválida ou expirada.",
      };
    }

    return {
      success: true,
      user: sessao.usuario,
      session: {
        expiresAt: sessao.sessao.expiresAt,
      },
    };
  });
