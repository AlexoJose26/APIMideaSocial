import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { authRoutes } from "./routes/auth";
import { usuariosRoutes } from "./routes/usuarios.routes";
import { livrosRoutes } from "./routes/livros.routes";
import { criticasRoutes } from "./routes/criticas.routes";
import { estantesRoutes } from "./routes/estantes.routes";
import { feedRoutes } from "./routes/feed.routes";
import { likesRoutes } from "./routes/likes.routes";
import { comentariosRoutes } from "./routes/comentarios.routes";

export function createApp() {
  const app = new Elysia()
    .use(
      cors({
        origin: true,
        credentials: true,
      }),
    )

    .use(authRoutes)

    .use(usuariosRoutes)

    .use(livrosRoutes)

    .use(criticasRoutes)

    .use(estantesRoutes)

    .use(feedRoutes)

    .use(likesRoutes)

    .use(comentariosRoutes)

    .get("/health", () => ({
      status: "ok",
      service: "MedeaSocial API",
      time: new Date().toISOString(),
    }));

  return app;
}
