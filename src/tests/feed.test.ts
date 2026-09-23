import { describe, test, expect } from "bun:test";

import { createTestDb } from "../db/test-db";

import {
  criarPost,
  listarFeed,
} from "../services/feed";

import { criarUsuario } from "../services/usuarios";

describe("Feed - PostgreSQL", () => {
  test("Cria post", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Adilson-${crypto.randomUUID()}`,
      "Senha123",
    );

    await criarPost(
      db,
      u.id,
      "LOGIN",
    );

    const lista = await listarFeed(db);

    expect(
      lista.some(
        (post) =>
          post.usuario_id === u.id &&
          post.tipo === "LOGIN",
      ),
    ).toBe(true);
  });

  test("Contém post criado", async () => {
    const db = createTestDb();

    const nome = `David-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    await criarPost(
      db,
      u.id,
      "LOGIN",
    );

    const lista = await listarFeed(db);

    const post = lista.find(
      (item) =>
        item.usuario_id === u.id,
    );

    expect(post).toBeTruthy();

    expect(post).toEqual(
      expect.objectContaining({
        tipo: "LOGIN",
      }),
    );

    expect(post?.usuario?.nome).toBe(nome);
  });

  test("Usuário correto", async () => {
    const db = createTestDb();

    const nome = `Jorge-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    await criarPost(
      db,
      u.id,
      "LOGIN",
    );

    const lista = await listarFeed(db);

    const post = lista.find(
      (item) =>
        item.usuario_id === u.id,
    );

    expect(post?.usuario?.nome).toBe(nome);
  });

  test("Array válido", async () => {
    const db = createTestDb();

    const lista = await listarFeed(db);

    expect(Array.isArray(lista)).toBe(true);
  });

  test("Múltiplos posts", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Dario-${crypto.randomUUID()}`,
      "Senha123",
    );

    await criarPost(
      db,
      u.id,
      "LOGIN",
    );

    await criarPost(
      db,
      u.id,
      "POST",
    );

    const lista = await listarFeed(db);

    const postsDoUsuario = lista.filter(
      (post) =>
        post.usuario_id === u.id,
    );

    expect(postsDoUsuario.length).toBe(2);
  });

  test("Tipo não vazio", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Tiago-${crypto.randomUUID()}`,
      "Senha123",
    );

    await criarPost(
      db,
      u.id,
      "LOGIN",
    );

    const lista = await listarFeed(db);

    const post = lista.find(
      (item) =>
        item.usuario_id === u.id,
    );

    expect(post?.tipo).toBeTruthy();
  });

  test("Usuário contém dados do utilizador", async () => {
    const db = createTestDb();

    const nome = `Diogo-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    await criarPost(
      db,
      u.id,
      "LOGIN",
    );

    const lista = await listarFeed(db);

    const post = lista.find(
      (item) =>
        item.usuario_id === u.id,
    );

    expect(post?.usuario).toBeTruthy();
    expect(post?.usuario?.nome).toBe(nome);
  });
});
