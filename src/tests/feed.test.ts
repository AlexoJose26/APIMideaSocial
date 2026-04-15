import { describe,expect, test } from "bun:test";
import { criarUsuario } from "../services/usuarios";
import { criarFeed, listarFeed } from "../services/feed";

describe("Feed", () => {
  test("cria feed", () => {
    const u = criarUsuario("A", "1");

    criarFeed(u.id, "LOGIN");

    expect(listarFeed().length).toBe(1);
  });
});
