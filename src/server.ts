import { serve } from "bun";
import { usuariosRoutes } from "./routes/usuarios.routes";
import { livrosRoutes } from "./routes/livros.routes";
import { criticasRoutes } from "./routes/criticas.routes";
import { estantesRoutes } from "./routes/estantes.routes";
import { feedRoutes } from "./routes/feed.routes";

export const server = serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    try {

      if (url.pathname.startsWith("/usuarios")) {
        return usuariosRoutes(req);
      }


      if (url.pathname.startsWith("/livros")) {
        return livrosRoutes(req);
      }


      if (url.pathname.startsWith("/criticas")) {
        return criticasRoutes(req);
      }


      if (url.pathname.startsWith("/estantes")) {
        return estantesRoutes(req);
      }


      if (url.pathname.startsWith("/feed")) {
        return feedRoutes(req);
      }

      return Response.json({ error: "Rota não encontrada" }, { status: 404 });

    } catch (err) {
      console.error(err);

      return Response.json(
        { error: "Erro interno no servidor" },
        { status: 500 }
      );
    }
  },
});

console.log("API rodando em http://localhost:3000");
