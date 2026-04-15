import { serve } from "bun";

import {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
  buscarUsuario,
} from "./services/usuarios";


import {
  criarPost,
  listarFeed,
} from "./services/feed";

serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);
    const method = req.method;


    if (url.pathname === "/usuarios" && method === "GET") {
      return Response.json(listarUsuarios());
    }


    if (url.pathname.startsWith("/usuarios/") && method === "GET") {
      const id = url.pathname.split("/")[2];
      return Response.json(buscarUsuario(id));
    }


    if (url.pathname === "/usuarios" && method === "POST") {
      const body = await req.json();
      const user = await criarUsuario(body.nome, body.senha);
      return Response.json(user);
    }


    if (url.pathname.startsWith("/usuarios/") && method === "PUT") {
      const id = url.pathname.split("/")[2];
      const body = await req.json();

      await atualizarUsuario(id, body.nome);

      return Response.json({
        message: "Usuário atualizado com sucesso",
      });
    }


    if (url.pathname.startsWith("/usuarios/") && method === "DELETE") {
      const id = url.pathname.split("/")[2];

      await deletarUsuario(id);

      return Response.json({
        message: "Usuário removido com sucesso",
      });
    }


    if (url.pathname === "/feed" && method === "GET") {
      return Response.json(listarFeed());
    }


    if (url.pathname === "/feed" && method === "POST") {
      const body = await req.json();

      const post = await criarPost(
        body.usuario_id,
        body.tipo
      );

      return Response.json(post);
    }



    return new Response(
      JSON.stringify({ error: "Rota não encontrada" }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
});

console.log("API rodando em http://localhost:3000");
