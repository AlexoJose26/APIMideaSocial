import { Elysia, t } from "elysia";

import { db } from "../db";

import {
  criarCritica,
  listarCriticas,
  atualizarCritica,
  deletarCritica,
} from "../services/criticas";

export const criticasRoutes = new Elysia({
  prefix: "/criticas",
})
  .get("/", async ({ set }) => {
    try {
      return await listarCriticas(db);
    } catch (error) {
      console.error("Erro ao listar críticas:", error);

      set.status = 500;

      return {
        success: false,
        message: "Não foi possível listar as críticas.",
      };
    }
  })

  .post(
    "/",
    async ({ body, set }) => {
      try {
        return await criarCritica(
          db,
          body.usuario_id,
          body.livro_id,
          body.texto,
          body.nota,
        );
      } catch (error) {
        console.error("Erro ao criar crítica:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível criar a crítica.",
        };
      }
    },
    {
      body: t.Object({
        usuario_id: t.String(),
        livro_id: t.String(),
        texto: t.String({
          minLength: 1,
        }),
        nota: t.Number({
          minimum: 0,
          maximum: 5,
        }),
      }),
    },
  )

  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        await atualizarCritica(
          db,
          params.id,
          body.texto,
        );

        return {
          success: true,
          message: "Crítica atualizada com sucesso.",
        };
      } catch (error) {
        console.error("Erro ao atualizar crítica:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível atualizar a crítica.",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),

      body: t.Object({
        texto: t.String({
          minLength: 1,
        }),
      }),
    },
  )

  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        await deletarCritica(
          db,
          params.id,
        );

        return {
          success: true,
          message: "Crítica removida com sucesso.",
        };
      } catch (error) {
        console.error("Erro ao remover crítica:", error);

        set.status = 500;

        return {
          success: false,
          message: "Não foi possível remover a crítica.",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
