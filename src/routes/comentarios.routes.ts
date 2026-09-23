import { Elysia, t } from "elysia";

import { db } from "../db";
import {
  criarComentario,
  listarComentarios,
  deletarComentario,
} from "../services/comentarios";

export const comentariosRoutes = new Elysia({
  prefix: "/comentarios",
})
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const comentario = await criarComentario(
          db,
          body.feed_id,
          body.usuario_id,
          body.texto,
        );

        return comentario;
      } catch (error) {
        console.error("Erro ao criar comentário:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível criar o comentário.",
        };
      }
    },
    {
      body: t.Object({
        feed_id: t.String(),
        usuario_id: t.String(),
        texto: t.String({
          minLength: 1,
        }),
      }),
    },
  )

  .get(
    "/:feed_id",
    async ({ params, set }) => {
      try {
        return await listarComentarios(db, params.feed_id);
      } catch (error) {
        console.error("Erro ao listar comentários:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível listar os comentários.",
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
        await deletarComentario(db, body.id);

        return {
          success: true,
          message: "Comentário removido com sucesso.",
        };
      } catch (error) {
        console.error("Erro ao deletar comentário:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível remover o comentário.",
        };
      }
    },
    {
      body: t.Object({
        id: t.String(),
      }),
    },
  );
