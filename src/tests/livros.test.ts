import { describe, test, expect } from "bun:test";
import { createTestDb } from "../db/test-db";
import {
  criarLivro,
  listarLivros,
  buscarLivro,
  atualizarLivro,
  deletarLivro,
} from "../services/livros";

describe("Livros CRUD - profissional", () => {

  test("cria livro com sucesso", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Clean Code");

    expect(l.titulo).toBe("Clean Code");
    expect(l.id).toBeTruthy();
  });

  test("lista livros retorna array", () => {
    const db = createTestDb();

    expect(Array.isArray(listarLivros(db))).toBeTruthy();
  });

  test("livro é adicionado corretamente", async () => {
    const db = createTestDb();

    await criarLivro(db, "Livro 1");

    expect(listarLivros(db)).toHaveLength(1);
  });

  test("busca livro por id", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Livro 2");

    const found = buscarLivro(db, l.id);

    expect(found?.id).toBe(l.id);
  });

  test("livro existe após criação (toContainEqual)", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Livro 3");

    const list = listarLivros(db);

    expect(list).toContainEqual(
      expect.objectContaining({
        id: l.id,
        titulo: "Livro 3",
      })
    );
  });

  test("atualiza livro com sucesso", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Old");

    await atualizarLivro(db, l.id, "New");

    const updated = buscarLivro(db, l.id);

    expect(updated?.titulo).toBe("New");
  });

  test("remove livro corretamente", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Delete");

    await deletarLivro(db, l.id);

    expect(buscarLivro(db, l.id)).toBeFalsy();
  });

  test("titulo não é vazio", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "X");

    expect(l.titulo.length).toBeGreaterThan(0);
  });

  test("id é string válida", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Y");

    expect(typeof l.id).toBe("string");
  });

  test("livro não é nulo após criação", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Z");

    expect(l).toBeTruthy();
  });

  test("livros aumentam após inserção múltipla", async () => {
    const db = createTestDb();

    await criarLivro(db, "A");
    await criarLivro(db, "B");

    expect(listarLivros(db).length).toBeGreaterThan(1);
  });
});
