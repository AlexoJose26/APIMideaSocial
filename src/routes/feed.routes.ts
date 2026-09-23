import { Elysia, t } from "elysia";

import { db } from "../db";

import {
  criarPost,
  listarFeed,
} from "../services/feed";

export const feedRoutes = new Elysia({
  prefix: "/feed",
})
  .get("/", async ({ set }) => {
    try {
      return await listarFeed(db);
    } catch (error) {
      console.error("Erro ao listar feed:", error);

      set.status = 500;

      return {
        success: false,
        message: "Não foi possível carregar o feed.",
      };
    }
  })

  .post(
    "/",
    async ({ body, set }) => {
      try {
        return await criarPost(
          db,
          body.usuario_id,
          body.tipo,
        );
      } catch (error) {
        console.error("Erro ao criar publicação:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível criar a publicação.",
        };
      }
    },
    {
      body: t.Object({
        usuario_id: t.String(),
        tipo: t.String({
          minLength: 1,
        }),
      }),
    },
  );
