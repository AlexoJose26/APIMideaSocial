import { db } from "../db/index";
import {
  criarCritica,
  listarCriticas,
  atualizarCritica,
  deletarCritica,
} from "../services/criticas";

export async function criticasRoutes(req: Request) {
  const url = new URL(req.url);
  const method = req.method;

  // GET /criticas
  if (url.pathname === "/criticas" && method === "GET") {
    return Response.json(listarCriticas(db));
  }

  // POST /criticas
  if (url.pathname === "/criticas" && method === "POST") {
    const body = await req.json();

    const result = await criarCritica(
      db,
      body.usuario_id,
      body.livro_id,
      body.texto,
      body.nota
    );

    return Response.json(result);
  }

  // PUT /criticas/:id
  if (url.pathname.startsWith("/criticas/") && method === "PUT") {
    const id = Number(url.pathname.split("/")[2]);
    const body = await req.json();

    await atualizarCritica(db, id, body.texto);

    return Response.json({ message: "Crítica atualizada" });
  }

  // DELETE /criticas/:id
  if (url.pathname.startsWith("/criticas/") && method === "DELETE") {
    const id = Number(url.pathname.split("/")[2]);

    await deletarCritica(db, id);

    return Response.json({ message: "Crítica removida" });
  }

  return new Response("Not found", { status: 404 });
}
