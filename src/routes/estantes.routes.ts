import { db } from "../db/index";
import {
  adicionarEstante,
  listarEstante,
  atualizarStatus,
  removerEstante,
} from "../services/estantes";

export async function estantesRoutes(req: Request) {
  const url = new URL(req.url);
  const method = req.method;

  // GET /estantes/:usuario_id
  if (url.pathname.startsWith("/estantes/") && method === "GET") {
    const usuario_id = url.pathname.split("/")[2];

    return Response.json(listarEstante(db, usuario_id));
  }

  // POST /estantes
  if (url.pathname === "/estantes" && method === "POST") {
    const body = await req.json();

    const result = await adicionarEstante(
      db,
      body.usuario_id,
      body.livro_id,
      body.status
    );

    return Response.json(result);
  }

  // PUT /estantes/:id
  if (url.pathname.startsWith("/estantes/") && method === "PUT") {
    const id = Number(url.pathname.split("/")[2]);
    const body = await req.json();

    await atualizarStatus(db, id, body.status);

    return Response.json({ message: "Status atualizado" });
  }

  // DELETE /estantes/:id
  if (url.pathname.startsWith("/estantes/") && method === "DELETE") {
    const id = Number(url.pathname.split("/")[2]);

    await removerEstante(db, id);

    return Response.json({ message: "Removido da estante" });
  }

  return new Response("Not found", { status: 404 });
}
