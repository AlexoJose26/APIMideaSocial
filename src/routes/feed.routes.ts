import { db } from "../db/index";
import { criarPost, listarFeed } from "../services/feed";

export async function feedRoutes(req: Request) {
  const url = new URL(req.url);
  const method = req.method;


  if (url.pathname === "/feed" && method === "GET") {
    return Response.json(listarFeed(db));
  }

  if (url.pathname === "/feed" && method === "POST") {
    const body = await req.json();

    const post = await criarPost(
      db,
      body.usuario_id,
      body.tipo
    );

    return Response.json(post);
  }

  return new Response("Not found", { status: 404 });
}
