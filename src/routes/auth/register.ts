import { Elysia } from "elysia";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import { usuarios } from "../../db/schema";
import { criarSessao } from "./session";

export const registerRoute = new Elysia()
  .post("/register", async ({ body, set }) => {
    const data = body as {
      nome?: string;
      senha?: string;
    };

    const nome = data.nome?.trim();
    const senha = data.senha;

    if (!nome || !senha) {
      set.status = 400;

      return {
        success: false,
        message: "Nome e senha são obrigatórios.",
      };
    }

    if (nome.length < 3) {
      set.status = 400;

      return {
        success: false,
        message: "O nome deve ter pelo menos 3 caracteres.",
      };
    }

    if (senha.length < 6) {
      set.status = 400;

      return {
        success: false,
        message: "A senha deve ter pelo menos 6 caracteres.",
      };
    }

    const existente = await db
      .select({
        id: usuarios.id,
      })
      .from(usuarios)
      .where(eq(usuarios.nome, nome))
      .limit(1);

    if (existente.length > 0) {
      set.status = 409;

      return {
        success: false,
        message: "Este nome de utilizador já está em uso.",
      };
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const usuarioId = randomUUID();

    const [usuario] = await db
      .insert(usuarios)
      .values({
        id: usuarioId,
        nome,
        senha: senhaHash,
        foto_perfil: null,
      })
      .returning({
        id: usuarios.id,
        nome: usuarios.nome,
        foto_perfil: usuarios.foto_perfil,
        createdAt: usuarios.createdAt,
      });

    const sessao = await criarSessao(
      db,
      usuario.id,
    );

    set.status = 201;

    return {
      success: true,
      message: "Conta criada com sucesso.",
      token: sessao.token,
      expiresAt: sessao.expiresAt,
      user: usuario,
    };
  });
