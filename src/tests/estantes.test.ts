import { describe, test, expect } from "bun:test";

import { createTestDb } from "../db/test-db";

import {
  adicionarEstante,
  listarEstante,
  atualizarStatus,
  removerEstante,
} from "../services/estantes";

import { criarUsuario } from "../services/usuarios";
import { criarLivro } from "../services/livros";

describe("Estantes CRUD - PostgreSQL", () => {
  test("Adiciona livro", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Adilson-${crypto.randomUUID()}`,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "Livro",
    );

    await adicionarEstante(
      db,
      u.id,
      l.id,
      "lendo",
    );

    const lista = await listarEstante(
      db,
      u.id,
    );

    expect(
      lista.some(
        (item) =>
          item.usuario_id === u.id &&
          item.livro_id === l.id,
      ),
    ).toBe(true);
  });

  test("Lista não vazia", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `David-${crypto.randomUUID()}`,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "Pai Rico",
    );

    await adicionarEstante(
      db,
      u.id,
      l.id,
      "lendo",
    );

    const lista = await listarEstante(
      db,
      u.id,
    );

    expect(lista.length).toBeGreaterThan(0);
  });

  test("Status correto", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Jorge-${crypto.randomUUID()}`,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "Livro",
    );

    await adicionarEstante(
      db,
      u.id,
      l.id,
      "lido",
    );

    const lista = await listarEstante(
      db,
      u.id,
    );

    const item = lista.find(
      (estante) =>
        estante.livro_id === l.id,
    );

    expect(item?.status).toBe("lido");
  });

  test("Estrutura contém usuario e livro", async () => {
    const db = createTestDb();

    const nome = `Tiago-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "Livro",
    );

    await adicionarEstante(
      db,
      u.id,
      l.id,
      "lendo",
    );

    const lista = await listarEstante(
      db,
      u.id,
    );

    const e = lista.find(
      (item) =>
        item.livro_id === l.id,
    );

    expect(e).toBeTruthy();
    expect(e).toHaveProperty("usuario");
    expect(e).toHaveProperty("livro");
  });

  test("Atualiza status", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Simone-${crypto.randomUUID()}`,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "Livro",
    );

    await adicionarEstante(
      db,
      u.id,
      l.id,
      "lendo",
    );

    const lista = await listarEstante(
      db,
      u.id,
    );

    const e = lista.find(
      (item) =>
        item.livro_id === l.id,
    );

    expect(e).toBeTruthy();

    await atualizarStatus(
      db,
      e!.id,
      u.id,
      "lido",
    );

    const atualizada = await listarEstante(
      db,
      u.id,
    );

    const resultado = atualizada.find(
      (item) =>
        item.id === e!.id,
    );

    expect(resultado?.status).toBe("lido");
  });

  test("Remove estante", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Diogo-${crypto.randomUUID()}`,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "Livro",
    );

    await adicionarEstante(
      db,
      u.id,
      l.id,
      "lendo",
    );

    const lista = await listarEstante(
      db,
      u.id,
    );

    const e = lista.find(
      (item) =>
        item.livro_id === l.id,
    );

    expect(e).toBeTruthy();

    await removerEstante(
      db,
      e!.id,
      u.id,
    );

    const depois = await listarEstante(
      db,
      u.id,
    );

    expect(
      depois.some(
        (item) =>
          item.id === e!.id,
      ),
    ).toBe(false);
  });

  test("Retorno contém dados corretos", async () => {
    const db = createTestDb();

    const nome = `Gustavo-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "IA",
    );

    await adicionarEstante(
      db,
      u.id,
      l.id,
      "lendo",
    );

    const lista = await listarEstante(
      db,
      u.id,
    );

    const e = lista.find(
      (item) =>
        item.livro_id === l.id,
    );

    expect(e).toBeTruthy();
    expect(e?.usuario?.nome).toBe(nome);
    expect(e?.livro?.titulo).toBe("IA");
  });
});
