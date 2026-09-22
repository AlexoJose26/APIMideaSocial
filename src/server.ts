import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { usuariosRoutes } from "./routes/usuarios.routes";
import { livrosRoutes } from "./routes/livros.routes";
import { criticasRoutes } from "./routes/criticas.routes";
import { estantesRoutes } from "./routes/estantes.routes";
import { feedRoutes } from "./routes/feed.routes";
import { likesRoutes } from "./routes/likes.routes";
import { comentariosRoutes } from "./routes/comentarios.routes";
import { authRoutes } from "./routes/auth";

export function createApp() {
  const app = new Elysia()
    .use(
      cors({
        origin: true,
        credentials: true,
      }),
    )

    .group("/auth", (app) =>
      authRoutes(app),
    )

    .group("/usuarios", (app) =>
      usuariosRoutes(app),
    )

    .group("/livros", (app) =>
      livrosRoutes(app),
    )

    .group("/criticas", (app) =>
      criticasRoutes(app),
    )

    .group("/estantes", (app) =>
      estantesRoutes(app),
    )

    .group("/feed", (app) =>
      feedRoutes(app),
    )

    .group("/likes", (app) =>
      likesRoutes(app),
    )

    .group("/comentarios", (app) =>
      comentariosRoutes(app),
    )

    .get("/health", () => ({
      status: "ok",
      service: "MedeaSocial API",
      time: new Date().toISOString(),
    }));

  return app;
}
