import { usuarios } from "../db/schema";
import { eq } from "drizzle-orm";
import type { DB } from "../db/types/db";

const sessions = new Map<string, string>(); 

function generateToken() {
  return crypto.randomUUID();
}

export async function login(db: DB, nome: string, senha: string) {
  if (!nome || !senha) {
    return { error: "Dados inválidos" };
  }

  const user = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.nome, nome))
    .get();

  if (!user || user.senha !== senha) {
    return { error: "Credenciais inválidas" };
  }

  const token = generateToken();

  sessions.set(token, user.id);

  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      foto_perfil: user.foto_perfil,
    },
  };
}

export function logout(token: string) {
  sessions.delete(token);
  return { message: "Logout feito com sucesso" };
}

export function getUserByToken(token: string) {
  const userId = sessions.get(token);
  return userId || null;
}
