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

  try {
   
    if (url.pathname === "/estantes" && method === "GET") {
      const usuario_id = url.searchParams.get("usuario_id");

      if (!usuario_id) {
        return Response.json(
          { error: "usuario_id obrigatório" },
          { status: 400 }
        );
      }

      const result = listarEstante(db, usuario_id);

      return Response.json(result ?? []);
    }



    if (url.pathname === "/estantes" && method === "POST") {
      const body = await req.json();

      if (!body.usuario_id || !body.livro_id || !body.status) {
        return Response.json(
          { error: "Dados inválidos" },
          { status: 400 }
        );
      }

      const result = await adicionarEstante(
        db,
        body.usuario_id,
        body.livro_id,
        body.status
      );

      return Response.json(result);
    }


    if (url.pathname.startsWith("/estantes/") && method === "PUT") {
      const id = Number(url.pathname.split("/")[2]);

      if (!id) {
        return Response.json(
          { error: "ID inválido" },
          { status: 400 }
        );
      }

      const body = await req.json();

      if (!body.status) {
        return Response.json(
          { error: "Status obrigatório" },
          { status: 400 }
        );
      }

      await atualizarStatus(db, id, body.status);

      return Response.json({ message: "Atualizado com sucesso" });
    }

    if (url.pathname.startsWith("/estantes/") && method === "DELETE") {
      const id = Number(url.pathname.split("/")[2]);

      if (!id) {
        return Response.json(
          { error: "ID inválido" },
          { status: 400 }
        );
      }

      await removerEstante(db, id);

      return Response.json({ message: "Removido com sucesso" });
    }


    return Response.json(
      { error: "Rota não encontrada" },
      { status: 404 }
    );

  } catch (err) {
    console.error("Erro estantesRoutes:", err);

    return Response.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
