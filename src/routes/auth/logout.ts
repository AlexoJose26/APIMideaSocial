import { Elysia } from "elysia";

import { db } from "../../db";
import { removerSessao } from "./session";

export const logoutRoute = new Elysia()
  .post("/logout", async ({ headers, set }) => {
    const authorization =
      headers.authorization;

    if (!authorization) {
      return {
        success: true,
        message: "Sessão encerrada.",
      };
    }

    const token = authorization.startsWith("Bearer ")
      ? authorization.substring(7).trim()
      : authorization.trim();

    if (!token) {
      return {
        success: true,
        message: "Sessão encerrada.",
      };
    }

    await removerSessao(db, token);

    set.status = 200;

    return {
      success: true,
      message: "Sessão encerrada com sucesso.",
    };
  });
