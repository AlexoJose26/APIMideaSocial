import { Elysia, t } from "elysia";

import { db } from "../db";

import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../services/usuarios";

export const usuariosRoutes = new Elysia({
  prefix: "/usuarios",
})
  .get("/", async ({ set }) => {
    try {
      return await listarUsuarios(db);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);

      set.status = 500;

      return {
        success: false,
        message: "Não foi possível listar os usuários.",
      };
    }
  })

  .get(
    "/:id",
    async ({ params, set }) => {
      try {
        const usuario = await buscarUsuario(
          db,
          params.id,
        );

        if (!usuario) {
          set.status = 404;

          return {
            success: false,
            message: "Usuário não encontrado.",
          };
        }

        return usuario;
      } catch (error) {
        console.error(
          "Erro ao buscar usuário:",
          error,
        );

        set.status = 500;

        return {
          success: false,
          message:
            "Não foi possível buscar o usuário.",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )

  .post(
    "/",
    async ({ body, set }) => {
      try {
        return await criarUsuario(
          db,
          body.nome,
          body.senha,
        );
      } catch (error) {
        console.error(
          "Erro ao criar usuário:",
          error,
        );

        set.status = 500;

        return {
          success: false,
          message:
            "Não foi possível criar o usuário.",
        };
      }
    },
    {
      body: t.Object({
        nome: t.String({
          minLength: 1,
        }),

        senha: t.String({
          minLength: 6,
        }),
      }),
    },
  )

  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const usuario =
          await atualizarUsuario(
            db,
            params.id,
            body.nome,
            body.foto_perfil,
          );

        return {
          success: true,
          message:
            "Usuário atualizado com sucesso.",
          user: usuario,
        };
      } catch (error) {
        console.error(
          "Erro ao atualizar usuário:",
          error,
        );

        set.status = 500;

        return {
          success: false,
          message:
            "Não foi possível atualizar o usuário.",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),

      body: t.Object({
        nome: t.String({
          minLength: 1,
        }),

        foto_perfil: t.Optional(
          t.Union([
            t.String(),
            t.Null(),
          ]),
        ),
      }),
    },
  )

  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        await deletarUsuario(
          db,
          params.id,
        );

        return {
          success: true,
          message:
            "Usuário removido com sucesso.",
        };
      } catch (error) {
        console.error(
          "Erro ao remover usuário:",
          error,
        );

        set.status = 500;

        return {
          success: false,
          message:
            "Não foi possível remover o usuário.",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
