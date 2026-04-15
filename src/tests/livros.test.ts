import { describe, test, expect } from "bun:test";
import { criarLivro, listarLivros } from "../services/livros";

describe("Livros CRUD", () => {
  test("cria livro", async () => {
    const l = await criarLivro("Clean Code", "Robert Martin");
    expect(l.titulo).toBe("Clean Code");
  });

  test("lista livros", () => {
    expect(listarLivros().length).toBeGreaterThan(0);
  });
});
