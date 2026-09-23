import { Elysia, t } from "elysia";

import { db } from "../db";

import {
  likePost,
  listarLikes,
  removerLike,
} from "../services/likes";

export const likesRoutes = new Elysia({
  prefix: "/likes",
})
  .post(
    "/",
    async ({ body, set }) => {
      try {
        return await likePost(
          db,
          body.feed_id,
          body.usuario_id,
        );
      } catch (error) {
        console.error("Erro ao curtir publicação:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível curtir a publicação.",
        };
      }
    },
    {
      body: t.Object({
        feed_id: t.String(),
        usuario_id: t.String(),
      }),
    },
  )

  .get(
    "/:feed_id",
    async ({ params, set }) => {
      try {
        return await listarLikes(
          db,
          params.feed_id,
        );
      } catch (error) {
        console.error("Erro ao listar curtidas:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível listar as curtidas.",
        };
      }
    },
    {
      params: t.Object({
        feed_id: t.String(),
      }),
    },
  )

  .delete(
    "/",
    async ({ body, set }) => {
      try {
        await removerLike(
          db,
          body.feed_id,
          body.usuario_id,
        );

        return {
          success: true,
          message: "Curtida removida com sucesso.",
        };
      } catch (error) {
        console.error("Erro ao remover curtida:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível remover a curtida.",
        };
      }
    },
    {
      body: t.Object({
        feed_id: t.String(),
        usuario_id: t.String(),
      }),
    },
  );
