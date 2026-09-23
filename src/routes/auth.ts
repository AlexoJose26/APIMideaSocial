import { Elysia } from "elysia";

import { loginRoute } from "./auth/login";
import { logoutRoute } from "./auth/logout";
import { meRoute } from "./auth/me";
import { registerRoute } from "./auth/register";

export const authRoutes = (app: Elysia) =>
  app.group("/auth", (auth) =>
    auth
      .use(registerRoute)
      .use(loginRoute)
      .use(logoutRoute)
      .use(meRoute),
  );
