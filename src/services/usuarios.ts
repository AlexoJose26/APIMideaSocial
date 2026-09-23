import bcrypt from "bcryptjs";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import type { AppDb } from "../db";
import { usuarios } from "../db/schema";

export async function criarUsuario(
  dbInstance: AppDb,
  nome: string,
  senha: string,
) {
  const nomeLimpo = nome.trim();

  if (!nomeLimpo || !senha) {
    throw new Error(
      "Nome e senha são obrigatórios.",
    );
  }

  if (senha.length < 6) {
    throw new Error(
      "A senha deve ter pelo menos 6 caracteres.",
    );
  }

  const [existente] = await dbInstance
    .select({
      id: usuarios.id,
    })
    .from(usuarios)
    .where(eq(usuarios.nome, nomeLimpo))
    .limit(1);

  if (existente) {
    throw new Error(
      "Já existe um utilizador com esse nome.",
    );
  }

  const senhaHash = await bcrypt.hash(
    senha,
    12,
  );

  const [novoUsuario] = await dbInstance
    .insert(usuarios)
    .values({
      id: randomUUID(),
      nome: nomeLimpo,
      senha: senhaHash,
      createdAt: new Date(),
    })
    .returning({
      id: usuarios.id,
      nome: usuarios.nome,
      foto_perfil: usuarios.foto_perfil,
      createdAt: usuarios.createdAt,
    });

  if (!novoUsuario) {
    throw new Error(
      "Não foi possível criar o utilizador.",
    );
  }

  return novoUsuario;
}

export async function listarUsuarios(
  dbInstance: AppDb,
) {
  return await dbInstance
    .select({
      id: usuarios.id,
      nome: usuarios.nome,
      foto_perfil: usuarios.foto_perfil,
      createdAt: usuarios.createdAt,
    })
    .from(usuarios)
    .orderBy(desc(usuarios.createdAt));
}

export async function buscarUsuario(
  dbInstance: AppDb,
  id: string,
) {
  if (!id) {
    return null;
  }

  const [usuario] = await dbInstance
    .select({
      id: usuarios.id,
      nome: usuarios.nome,
      foto_perfil: usuarios.foto_perfil,
      createdAt: usuarios.createdAt,
    })
    .from(usuarios)
    .where(eq(usuarios.id, id))
    .limit(1);

  return usuario ?? null;
}

export async function atualizarUsuario(
  dbInstance: AppDb,
  id: string,
  nome: string,
) {
  const nomeLimpo = nome.trim();

  if (!id || !nomeLimpo) {
    throw new Error("Dados inválidos.");
  }

  const [outroUsuario] = await dbInstance
    .select({
      id: usuarios.id,
    })
    .from(usuarios)
    .where(eq(usuarios.nome, nomeLimpo))
    .limit(1);

  if (
    outroUsuario &&
    outroUsuario.id !== id
  ) {
    throw new Error(
      "Esse nome de utilizador já está em uso.",
    );
  }

  const [usuario] = await dbInstance
    .update(usuarios)
    .set({
      nome: nomeLimpo,
    })
    .where(eq(usuarios.id, id))
    .returning({
      id: usuarios.id,
      nome: usuarios.nome,
      foto_perfil: usuarios.foto_perfil,
      createdAt: usuarios.createdAt,
    });

  if (!usuario) {
    throw new Error(
      "Utilizador não encontrado.",
    );
  }

  return usuario;
}

export async function deletarUsuario(
  dbInstance: AppDb,
  id: string,
) {
  if (!id) {
    throw new Error("ID inválido.");
  }

  const resultado = await dbInstance
    .delete(usuarios)
    .where(eq(usuarios.id, id))
    .returning({
      id: usuarios.id,
    });

  if (resultado.length === 0) {
    throw new Error(
      "Utilizador não encontrado.",
    );
  }

  const usuario = resultado[0];

  if (!usuario) {
    throw new Error(
      "Utilizador não encontrado.",
    );
  }

  return {
    success: true,
    id: usuario.id,
  };
}
