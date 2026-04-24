import { db } from "../db";
import {
  criarComentario,
  listarComentarios,
  deletarComentario
} from "../services/comentarios";

export async function comentariosRoutes(req: Request) {
  const url = new URL(req.url);
  const method = req.method;

  if (url.pathname === "/comentarios" && method === "POST") {
    const body = await req.json();

    return Response.json(
      await criarComentario(db, body.feed_id, body.usuario_id, body.texto)
    );
  }

  if (url.pathname.startsWith("/comentarios/") && method === "GET") {
    const feed_id = url.pathname.split("/")[2];
    return Response.json(listarComentarios(db, feed_id));
  }

  if (url.pathname === "/comentarios" && method === "DELETE") {
    const body = await req.json();
    await deletarComentario(db, body.id);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Not found" }, { status: 404 });
}
