import { sessions } from "./session";

export async function logoutRoute(req: Request) {
  const token = req.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  if (!token) {
    return Response.json({ error: "Sem token" }, { status: 401 });
  }

  sessions.delete(token);

  return Response.json({
    success: true,
    message: "Logout efetuado",
  });
}
