import { db } from "../db";
import { likePost, listarLikes, removerLike } from "../services/likes";

export async function likesRoutes(req: Request) {
  const url = new URL(req.url);
  const method = req.method;

  if (url.pathname === "/likes" && method === "POST") {
    const body = await req.json();
    return Response.json(await likePost(db, body.feed_id, body.usuario_id));
  }

  if (url.pathname.startsWith("/likes/") && method === "GET") {
    const feed_id = url.pathname.split("/")[2];
    return Response.json(listarLikes(db, feed_id));
  }

  if (url.pathname === "/likes" && method === "DELETE") {
    const body = await req.json();
    await removerLike(db, body.feed_id, body.usuario_id);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Not found" }, { status: 404 });
}
