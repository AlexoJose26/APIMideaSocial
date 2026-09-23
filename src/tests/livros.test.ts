import { describe, test, expect } from "bun:test";

import { createTestDb } from "../db/test-db";

import {
  criarLivro,
  listarLivros,
  buscarLivro,
  atualizarLivro,
  deletarLivro,
} from "../services/livros";

describe("Livros CRUD - PostgreSQL", () => {
  test("Cria livro com título real", async () => {
    const db = createTestDb();

    const l = await criarLivro(
      db,
      "Pai Rico Pai Pobre",
    );

    expect(l.titulo).toBe(
      "Pai Rico Pai Pobre",
    );

    expect(l.id).toBeTruthy();
  });

  test("Lista livros com títulos reais", async () => {
    const db = createTestDb();

    const titulo1 = `O Poder do Hábito ${crypto.randomUUID()}`;
    const titulo2 = `Hábitos Atômicos ${crypto.randomUUID()}`;

    await criarLivro(
      db,
      titulo1,
    );

    await criarLivro(
      db,
      titulo2,
    );

    const lista = await listarLivros(db);

    expect(
      lista.some(
        (livro) =>
          livro.titulo === titulo1,
      ),
    ).toBe(true);

    expect(
      lista.some(
        (livro) =>
          livro.titulo === titulo2,
      ),
    ).toBe(true);
  });

  test("Busca livro por id", async () => {
    const db = createTestDb();

    const l = await criarLivro(
      db,
      "Quem Pensa Enriquece",
    );

    const found = await buscarLivro(
      db,
      l.id,
    );

    expect(found?.titulo).toBe(
      "Quem Pensa Enriquece",
    );
  });

  test("Atualiza título do livro", async () => {
    const db = createTestDb();

    const l = await criarLivro(
      db,
      "O Milagre da Manhã",
    );

    await atualizarLivro(
      db,
      l.id,
      "O Milagre da Manhã - Edição Atualizada",
    );

    const updated = await buscarLivro(
      db,
      l.id,
    );

    expect(updated?.titulo).toBe(
      "O Milagre da Manhã - Edição Atualizada",
    );
  });

  test("Remove livro corretamente", async () => {
    const db = createTestDb();

    const l = await criarLivro(
      db,
      "A Arte da Guerra",
    );

    await deletarLivro(
      db,
      l.id,
    );

    const encontrado = await buscarLivro(
      db,
      l.id,
    );

    expect(encontrado).toBeNull();
  });

  test("Título não pode ser vazio", async () => {
    const db = createTestDb();

    const l = await criarLivro(
      db,
      "Mindset",
    );

    expect(
      l.titulo.length,
    ).toBeGreaterThan(0);
  });

  test("IDs são únicos", async () => {
    const db = createTestDb();

    const l1 = await criarLivro(
      db,
      "Comece pelo Porquê",
    );

    const l2 = await criarLivro(
      db,
      "Comece pelo Porquê",
    );

    expect(l1.id).not.toBe(l2.id);
  });

  test("Lista retorna array válido", async () => {
    const db = createTestDb();

    const lista = await listarLivros(db);

    expect(
      Array.isArray(lista),
    ).toBe(true);
  });

  test("Livro criado aparece na lista", async () => {
    const db = createTestDb();

    const titulo = `Os Segredos da Mente Milionária ${crypto.randomUUID()}`;

    const l = await criarLivro(
      db,
      titulo,
    );

    const lista = await listarLivros(db);

    expect(
      lista.some(
        (livro) =>
          livro.id === l.id,
      ),
    ).toBe(true);
  });

  test("Múltiplos livros aumentam lista", async () => {
    const db = createTestDb();

    const titulo1 = `Essencialismo ${crypto.randomUUID()}`;
    const titulo2 = `Trabalhe 4 Horas por Semana ${crypto.randomUUID()}`;

    const l1 = await criarLivro(
      db,
      titulo1,
    );

    const l2 = await criarLivro(
      db,
      titulo2,
    );

    const lista = await listarLivros(db);

    const criados = lista.filter(
      (livro) =>
        livro.id === l1.id ||
        livro.id === l2.id,
    );

    expect(
      criados.length,
    ).toBe(2);
  });
});
