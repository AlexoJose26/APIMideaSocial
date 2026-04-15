import { describe, expect, test } from "bun:test";
import { criarPost, listarFeed } from "../services/feed";
import { criarUsuario } from "../services/usuarios";

describe("Feed", () => {
  test("cria feed", async () => {
    const u = await criarUsuario("A", "1");

    await criarPost(u.id, "LOGIN");

    expect(listarFeed().length).toBe(1);
  });
});
