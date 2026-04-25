import { sessions } from "./session";
import { db } from "../../db";
import { usuarios } from "../../db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function loginRoute(req: Request) {
  const body = await req.json();

  const { nome, senha } = body;

  if (!nome || !senha) {
    return Response.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const user = db
    .select()
    .from(usuarios)
    .where(eq(usuarios.nome, nome))
    .get();

  if (!user || user.senha !== senha) {
    return Response.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = randomUUID();

  sessions.set(token, {
    userId: user.id,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return Response.json({
    token,
    user: {
      id: user.id,
      nome: user.nome,
    },
  });
}
