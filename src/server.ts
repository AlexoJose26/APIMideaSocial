import { serve } from "bun";

import { usuariosRoutes } from "./routes/usuarios.routes";
import { livrosRoutes } from "./routes/livros.routes";
import { criticasRoutes } from "./routes/criticas.routes";
import { estantesRoutes } from "./routes/estantes.routes";
import { feedRoutes } from "./routes/feed.routes";
import { likesRoutes } from "./routes/likes.routes";
import { comentariosRoutes } from "./routes/comentarios.routes";

const clients = new Set<any>();


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};


function broadcast(data: any) {
  const payload = JSON.stringify(data);

  for (const client of clients) {
    try {
      client.send(payload);
    } catch (err) {
      clients.delete(client);
    }
  }
}

export const server = serve({
  port: 3000,

  websocket: {
    open(ws) {
      clients.add(ws);
    },

    message(ws, message) {
      try {
        const data = JSON.parse(message.toString());
        broadcast(data);
      } catch (err) {
        console.error("WS erro:", err);
      }
    },

    close(ws) {
      clients.delete(ws);
    },
  },

  async fetch(req, server) {
    const url = new URL(req.url);


    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }


    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req);
      if (upgraded) return;
    }

    try {
      let res: Response;


      if (url.pathname.startsWith("/usuarios")) {
        res = await usuariosRoutes(req);
      } else if (url.pathname.startsWith("/livros")) {
        res = await livrosRoutes(req);
      } else if (url.pathname.startsWith("/criticas")) {
        res = await criticasRoutes(req);
      } else if (url.pathname.startsWith("/estantes")) {
        res = await estantesRoutes(req);
      } else if (url.pathname.startsWith("/feed")) {
        res = await feedRoutes(req);
      } else if (url.pathname.startsWith("/likes")) {
        res = await likesRoutes(req);
      } else if (url.pathname.startsWith("/comentarios")) {
        res = await comentariosRoutes(req);
      } else {
        res = Response.json(
          { error: "Rota não encontrada" },
          { status: 404 }
        );
      }

      Object.entries(corsHeaders).forEach(([key, value]) => {
        res.headers.set(key, value);
      });

      return res;

    } catch (err) {
      console.error("SERVER ERROR:", err);

      return Response.json(
        { error: "Erro interno no servidor" },
        { status: 500, headers: corsHeaders }
      );
    }
  },
});

console.log("API rodando em http://localhost:3000");
