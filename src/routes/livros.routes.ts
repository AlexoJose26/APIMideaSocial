import { Elysia, t } from "elysia";

import { db } from "../db";

import {
  criarLivro,
  listarLivros,
  buscarLivro,
  atualizarLivro,
  deletarLivro,
} from "../services/livros";

export const livrosRoutes = new Elysia({
  prefix: "/livros",
})

  // ============================================================
  // LISTAR TODOS OS LIVROS
  // GET /livros
  // ============================================================
  .get(
    "/",
    async ({ set }) => {
      try {
        const livros = await listarLivros(db);

        return {
          success: true,
          data: livros,
        };
      } catch (error) {
        console.error(
          "Erro ao listar livros:",
          error,
        );

        set.status = 500;

        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível listar os livros.",
        };
      }
    },
  )

  // ============================================================
  // BUSCAR LIVRO POR ID
  // GET /livros/:id
  // ============================================================
  .get(
    "/:id",
    async ({ params, set }) => {
      try {
        const livro = await buscarLivro(
          db,
          params.id,
        );

        if (!livro) {
          set.status = 404;

          return {
            success: false,
            message: "Livro não encontrado.",
          };
        }

        return {
          success: true,
          data: livro,
        };
      } catch (error) {
        console.error(
          "Erro ao buscar livro:",
          error,
        );

        set.status = 500;

        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível buscar o livro.",
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
  )

  // ============================================================
  // CRIAR LIVRO
  // POST /livros
  // ============================================================
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const livro = await criarLivro(
          db,
          body.titulo,
          body.autor,
        );

        set.status = 201;

        return {
          success: true,
          message: "Livro criado com sucesso.",
          data: livro,
        };
      } catch (error) {
        console.error(
          "Erro ao criar livro:",
          error,
        );

        set.status = 400;

        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível criar o livro.",
        };
      }
    },
    {
      body: t.Object({
        titulo: t.String({
          minLength: 1,
        }),

        autor: t.Optional(
          t.String(),
        ),
      }),
    },
  )

  // ============================================================
  // ATUALIZAR LIVRO
  // PUT /livros/:id
  // ============================================================
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const livro = await atualizarLivro(
          db,
          params.id,
          body.titulo,
        );

        return {
          success: true,
          message: "Livro atualizado com sucesso.",
          data: livro,
        };
      } catch (error) {
        console.error(
          "Erro ao atualizar livro:",
          error,
        );

        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar o livro.";

        if (
          mensagem.toLowerCase().includes(
            "não encontrado",
          )
        ) {
          set.status = 404;
        } else {
          set.status = 400;
        }

        return {
          success: false,
          message: mensagem,
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
        titulo: t.String({
          minLength: 1,
        }),
      }),
    },
  )

  // ============================================================
  // REMOVER LIVRO
  // DELETE /livros/:id
  // ============================================================
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        const resultado = await deletarLivro(
          db,
          params.id,
        );

        return {
          success: true,
          message: "Livro removido com sucesso.",
          data: resultado,
        };
      } catch (error) {
        console.error(
          "Erro ao remover livro:",
          error,
        );

        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível remover o livro.";

        if (
          mensagem.toLowerCase().includes(
            "não encontrado",
          )
        ) {
          set.status = 404;
        } else {
          set.status = 400;
        }

        return {
          success: false,
          message: mensagem,
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
