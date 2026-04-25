import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { meRoute } from "./me";

export async function authRoutes(req: Request) {
  const url = new URL(req.url);
  const method = req.method;

  if (url.pathname === "/auth/login" && method === "POST") {
    return loginRoute(req);
  }

  if (url.pathname === "/auth/logout" && method === "POST") {
    return logoutRoute(req);
  }

  if (url.pathname === "/auth/me" && method === "GET") {
    return meRoute(req);
  }

  return Response.json({ error: "Not found" }, { status: 404 });
}
