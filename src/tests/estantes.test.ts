import { describe,expect, test } from "bun:test";
import { criarUsuario } from "../services/usuarios";
import { criarLivro } from "../services/livros";
import { adicionarEstante, listarEstante } from "../services/estantes";

describe("Estantes CRUD", () => {
  test("adiciona livro na estante", async () => {
    const u = await criarUsuario("User1", "123");
    const l = await criarLivro("Livro 1");

    await adicionarEstante(u.id, l.id, "lendo");

    const estante = listarEstante(u.id);

    expect(estante.length).toBe(1);
  });
});
