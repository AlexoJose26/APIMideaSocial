import { describe, test, expect } from "bun:test";
import { criarUsuario } from "../services/usuarios";
import { criarLivro } from "../services/livros";
import { criarCritica, listarCriticas } from "../services/criticas";

describe("Criticas CRUD", () => {
  test("cria crítica", async () => {
    const u = await criarUsuario("User2", "123");
    const l = await criarLivro("Livro 2");

    await criarCritica(u.id, l.id, "Muito bom", 5);

    const criticas = listarCriticas();

    expect(criticas.length).toBeGreaterThan(0);
  });
});
