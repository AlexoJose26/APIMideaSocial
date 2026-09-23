import { Elysia, t } from "elysia";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import { usuarios } from "../../db/schema";
import { criarSessao } from "./session";

export const loginRoute = new Elysia()
  .post(
    "/login",
    async ({ body, set }) => {
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

      const resultado = await db
        .select({
          id: usuarios.id,
          nome: usuarios.nome,
          senha: usuarios.senha,
          foto_perfil:
            usuarios.foto_perfil,
          createdAt:
            usuarios.createdAt,
        })
        .from(usuarios)
        .where(eq(usuarios.nome, nome))
        .limit(1);

      const usuario = resultado[0];

      // ========================================================
      // UTILIZADOR NÃO ENCONTRADO
      // ========================================================

      if (!usuario) {
        set.status = 401;

        return {
          success: false,
          message:
            "Nome ou senha incorretos.",
        };
      }

      // ========================================================
      // VALIDAR SENHA
      // ========================================================

      const senhaValida =
        await bcrypt.compare(
          senha,
          usuario.senha,
        );

      if (!senhaValida) {
        set.status = 401;

        return {
          success: false,
          message:
            "Nome ou senha incorretos.",
        };
      }

      // ========================================================
      // CRIAR SESSÃO
      // ========================================================

      const sessao = await criarSessao(
        db,
        usuario.id,
      );

      // ========================================================
      // RESPOSTA
      // ========================================================

      return {
        success: true,
        message:
          "Login efetuado com sucesso.",

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
    },
    {
      body: t.Object({
        nome: t.String({
          minLength: 1,
        }),

        senha: t.String({
          minLength: 1,
        }),
      }),
    },
  );
