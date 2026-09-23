import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import { usuarios } from "../../db/schema";
import { criarUsuario } from "../../services/usuarios";
import { criarSessao } from "./session";

export const registerRoute = new Elysia()
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const nome = body.nome.trim();
        const senha = body.senha;

        if (!nome || !senha) {
          set.status = 400;

          return {
            success: false,
            message:
              "Nome e senha são obrigatórios.",
          };
        }

        // ======================================================
        // VERIFICAR SE JÁ EXISTE
        // ======================================================

        const existente =
          await db
            .select({
              id: usuarios.id,
            })
            .from(usuarios)
            .where(
              eq(
                usuarios.nome,
                nome,
              ),
            )
            .limit(1);

        if (existente.length > 0) {
          set.status = 409;

          return {
            success: false,
            message:
              "Já existe um utilizador com esse nome.",
          };
        }

        // ======================================================
        // CRIAR UTILIZADOR
        // ======================================================

        const usuario =
          await criarUsuario(
            db,
            nome,
            senha,
          );

        if (!usuario) {
          set.status = 500;

          return {
            success: false,
            message:
              "Não foi possível criar o utilizador.",
          };
        }

        // ======================================================
        // CRIAR SESSÃO
        // ======================================================

        const sessao =
          await criarSessao(
            db,
            usuario.id,
          );

        // ======================================================
        // RESPOSTA
        // ======================================================

        set.status = 201;

        return {
          success: true,
          message:
            "Conta criada com sucesso.",

          token: sessao.token,

          expiresAt:
            sessao.expiresAt,

          user: {
            id: usuario.id,
            nome: usuario.nome,
            foto_perfil:
              usuario.foto_perfil,
            createdAt:
              usuario.createdAt,
          },
        };
      } catch (error) {
        console.error(
          "Erro ao registrar utilizador:",
          error,
        );

        set.status = 400;

        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível criar a conta.",
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
  );
