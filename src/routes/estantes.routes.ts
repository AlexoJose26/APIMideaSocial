import { Elysia, t } from "elysia";

import {
  adicionarEstante,
  listarEstante,
  atualizarStatus,
  removerEstante,
} from "../services/estantes";

import { authMiddleware } from "../middlewares/auth";
import { db } from "../db";

export const estantesRoutes = new Elysia({
  prefix: "/estantes",
})
  .use(authMiddleware)

  // ==========================================================
  // LISTAR ESTANTE
  // ==========================================================
  .get(
    "/",
    async ({ usuario, set }) => {
      if (!usuario) {
        set.status = 401;

        return {
          success: false,
          message: "Não autenticado.",
        };
      }

      try {
        const estantes = await listarEstante(
          db,
          usuario.id,
        );

        return {
          success: true,
          data: estantes,
        };
      } catch (error) {
        console.error(
          "Erro ao listar estante:",
          error,
        );

        set.status = 500;

        return {
          success: false,
          message:
            "Não foi possível carregar a estante.",
        };
      }
    },
  )

  // ==========================================================
  // ADICIONAR LIVRO
  // ==========================================================
  .post(
    "/",
    async ({ usuario, body, set }) => {
      if (!usuario) {
        set.status = 401;

        return {
          success: false,
          message: "Não autenticado.",
        };
      }

      try {
        const resultado = await adicionarEstante(
          db,
          usuario.id,
          body.livro_id,
          body.status,
        );

        set.status = 201;

        return {
          success: true,
          data: resultado,
        };
      } catch (error) {
        console.error(
          "Erro ao adicionar livro à estante:",
          error,
        );

        set.status = 400;

        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível adicionar o livro à estante.",
        };
      }
    },
    {
      body: t.Object({
        livro_id: t.String({
          minLength: 1,
        }),
        status: t.String({
          minLength: 1,
        }),
      }),
    },
  )

  // ==========================================================
  // ATUALIZAR STATUS
  // ==========================================================
  .put(
    "/:id",
    async ({
      usuario,
      params,
      body,
      set,
    }) => {
      if (!usuario) {
        set.status = 401;

        return {
          success: false,
          message: "Não autenticado.",
        };
      }

      try {
        const resultado =
          await atualizarStatus(
            db,
            params.id,
            usuario.id,
            body.status,
          );

        return {
          success: true,
          data: resultado,
        };
      } catch (error) {
        console.error(
          "Erro ao atualizar status:",
          error,
        );

        set.status = 400;

        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível atualizar o status do livro.",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({
          minLength: 1,
        }),
      }),
      body: t.Object({
        status: t.String({
          minLength: 1,
        }),
      }),
    },
  )

  // ==========================================================
  // REMOVER DA ESTANTE
  // ==========================================================
  .delete(
    "/:id",
    async ({
      usuario,
      params,
      set,
    }) => {
      if (!usuario) {
        set.status = 401;

        return {
          success: false,
          message: "Não autenticado.",
        };
      }

      try {
        const resultado =
          await removerEstante(
            db,
            params.id,
            usuario.id,
          );

        return {
          success: true,
          data: resultado,
        };
      } catch (error) {
        console.error(
          "Erro ao remover livro da estante:",
          error,
        );

        set.status = 400;

        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível remover o livro da estante.",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({
          minLength: 1,
        }),
      }),
    },
  );
