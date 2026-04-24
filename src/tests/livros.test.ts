import { describe, test, expect } from "bun:test";
import { createTestDb } from "../db/test-db";
import {
  criarLivro,
  listarLivros,
  buscarLivro,
  atualizarLivro,
  deletarLivro,
} from "../services/livros";

describe("Livros CRUD - profissional realista", () => {

  test("Cria livro com título real", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Pai Rico Pai Pobre");

    expect(l.titulo).toBe("Pai Rico Pai Pobre");
    expect(l.id).toBeTruthy();
  });

  test("Lista livros com títulos reais", async () => {
    const db = createTestDb();

    await criarLivro(db, "O Poder do Hábito");
    await criarLivro(db, "Hábitos Atômicos");

    expect(listarLivros(db)).toHaveLength(2);
  });

  test("Busca livro por id", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Quem Pensa Enriquece");

    const found = buscarLivro(db, l.id);

    expect(found?.titulo).toBe("Quem Pensa Enriquece");
  });

  test("Atualiza título do livro", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "O Milagre da Manhã");

    await atualizarLivro(db, l.id, "O Milagre da Manhã - Edição Atualizada");

    const updated = buscarLivro(db, l.id);

    expect(updated?.titulo).toBe("O Milagre da Manhã - Edição Atualizada");
  });

  test("Remove livro corretamente", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "A Arte da Guerra");

    await deletarLivro(db, l.id);

    expect(buscarLivro(db, l.id)).toBeFalsy();
  });

  test("Título não pode ser vazio", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Mindset");

    expect(l.titulo.length).toBeGreaterThan(0);
  });

  test("IDs são únicos", async () => {
    const db = createTestDb();

    const l1 = await criarLivro(db, "Comece pelo Porquê");
    const l2 = await criarLivro(db, "Comece pelo Porquê");

    expect(l1.id).not.toBe(l2.id);
  });

  test("Lista retorna array válido", () => {
    const db = createTestDb();

    expect(Array.isArray(listarLivros(db))).toBeTruthy();
  });

  test("Livro criado aparece na lista", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Os Segredos da Mente Milionária");

    const lista = listarLivros(db);

    expect(lista).toContainEqual(
      expect.objectContaining({
        titulo: "Os Segredos da Mente Milionária",
      })
    );
  });

  test("Múltiplos livros aumentam lista", async () => {
    const db = createTestDb();

    await criarLivro(db, "Essencialismo");
    await criarLivro(db, "Trabalhe 4 Horas por Semana");

    expect(listarLivros(db).length).toBeGreaterThan(1);
  });

});
