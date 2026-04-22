import { db } from "../db/index";
import {
  criarLivro,
  listarLivros,
  buscarLivro,
  atualizarLivro,
  deletarLivro,
} from "../services/livros";

export async function livrosRoutes(req: Request) {
  const url = new URL(req.url);
  const method = req.method;

  if (url.pathname === "/livros" && method === "GET") {
    return Response.json(listarLivros(db));
  }

  if (url.pathname === "/livros" && method === "POST") {
    const body = await req.json();
    return Response.json(await criarLivro(db, body.titulo));
  }

  if (url.pathname.startsWith("/livros/") && method === "GET") {
    const id = url.pathname.split("/")[2];
    return Response.json(buscarLivro(db, id));
  }

  if (url.pathname.startsWith("/livros/") && method === "PUT") {
    const id = url.pathname.split("/")[2];
    const body = await req.json();

    await atualizarLivro(db, id, body.titulo);

    return Response.json({ message: "Atualizado" });
  }

  if (url.pathname.startsWith("/livros/") && method === "DELETE") {
    const id = url.pathname.split("/")[2];

    await deletarLivro(db, id);

    return Response.json({ message: "Removido" });
  }

  return new Response("Not found", { status: 404 });
}
