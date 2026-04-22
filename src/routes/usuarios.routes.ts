import { db } from "../db/index";
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../services/usuarios";

export async function usuariosRoutes(req: Request) {
  const url = new URL(req.url);
  const method = req.method;

  if (url.pathname === "/usuarios" && method === "GET") {
    return Response.json(listarUsuarios(db));
  }

  if (url.pathname === "/usuarios" && method === "POST") {
    const body = await req.json();
    const user = await criarUsuario(db, body.nome, body.senha);
    return Response.json(user);
  }

  if (url.pathname.startsWith("/usuarios/") && method === "GET") {
    const id = url.pathname.split("/")[2];
    return Response.json(buscarUsuario(db, id));
  }

  if (url.pathname.startsWith("/usuarios/") && method === "PUT") {
    const id = url.pathname.split("/")[2];
    const body = await req.json();

    await atualizarUsuario(db, id, body.nome);

    return Response.json({ message: "Atualizado" });
  }

  if (url.pathname.startsWith("/usuarios/") && method === "DELETE") {
    const id = url.pathname.split("/")[2];

    await deletarUsuario(db, id);

    return Response.json({ message: "Removido" });
  }

  return new Response("Not found", { status: 404 });
}
