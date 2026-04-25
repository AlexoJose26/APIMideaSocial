import { sessions } from "./session";
import { db } from "../../db";
import { usuarios } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function meRoute(req: Request) {
  const token = req.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  if (!token) {
    return Response.json({ error: "Sem token" }, { status: 401 });
  }

  const session = sessions.get(token);

  if (!session) {
    return Response.json({ error: "Sessão inválida" }, { status: 401 });
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);

    return Response.json({ error: "Sessão expirada" }, { status: 401 });
  }

  const user = db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, session.userId))
    .get();

  if (!user) {
    return Response.json({ error: "Utilizador não encontrado" }, { status: 404 });
  }

  return Response.json({
    id: user.id,
    nome: user.nome,
  });
}
