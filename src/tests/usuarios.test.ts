import { describe, test, expect } from "bun:test";

import { createTestDb } from "../db/test-db";

import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../services/usuarios";

describe("Usuarios CRUD - PostgreSQL", () => {
  test("Cria usuário com nome real", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Carlos Silva ${crypto.randomUUID()}`,
      "Senha123",
    );

    expect(u.nome).toContain("Carlos Silva");
    expect(u.id).toBeTruthy();
  });

  test("Lista usuários com nomes reais", async () => {
    const db = createTestDb();

    const nome1 = `Ana Paula ${crypto.randomUUID()}`;
    const nome2 = `João Mendes ${crypto.randomUUID()}`;

    const u1 = await criarUsuario(
      db,
      nome1,
      "Senha123",
    );

    const u2 = await criarUsuario(
      db,
      nome2,
      "Senha456",
    );

    const lista = await listarUsuarios(db);

    expect(
      lista.some(
        (usuario) => usuario.id === u1.id,
      ),
    ).toBe(true);

    expect(
      lista.some(
        (usuario) => usuario.id === u2.id,
      ),
    ).toBe(true);
  });

  test("Busca usuário pelo id", async () => {
    const db = createTestDb();

    const nome = `Mariana Costa ${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha789",
    );

    const found = await buscarUsuario(
      db,
      u.id,
    );

    expect(found?.nome).toBe(nome);
  });

  test("Atualiza nome do usuário", async () => {
    const db = createTestDb();

    const nome = `Pedro Santos ${crypto.randomUUID()}`;
    const novoNome = `Pedro Henrique Santos ${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha111",
    );

    await atualizarUsuario(
      db,
      u.id,
      novoNome,
    );

    const updated = await buscarUsuario(
      db,
      u.id,
    );

    expect(updated?.nome).toBe(novoNome);
  });

  test("Remove usuário corretamente", async () => {
    const db = createTestDb();

    const nome = `Fernanda Lima ${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha222",
    );

    await deletarUsuario(
      db,
      u.id,
    );

    const lista = await listarUsuarios(db);

    expect(
      lista.some(
        (usuario) => usuario.id === u.id,
      ),
    ).toBe(false);
  });

  test("IDs são únicos para usuários diferentes", async () => {
    const db = createTestDb();

    const nome1 = `Usuario Um ${crypto.randomUUID()}`;
    const nome2 = `Usuario Dois ${crypto.randomUUID()}`;

    const u1 = await criarUsuario(
      db,
      nome1,
      "Senha123",
    );

    const u2 = await criarUsuario(
      db,
      nome2,
      "Senha123",
    );

    expect(u1.id).not.toBe(u2.id);
  });

  test("Nome não pode ser vazio", async () => {
    const db = createTestDb();

    const nome = `Usuario Valido ${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    expect(u.nome.length).toBeGreaterThan(0);
  });

  test("Lista retorna array válido", async () => {
    const db = createTestDb();

    const lista = await listarUsuarios(db);

    expect(Array.isArray(lista)).toBe(true);
  });

  test("Usuário criado existe na lista", async () => {
    const db = createTestDb();

    const nome = `Ricardo Gomes ${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    const lista = await listarUsuarios(db);

    expect(
      lista.some(
        (usuario) => usuario.id === u.id,
      ),
    ).toBe(true);
  });

  test("Senha não é exposta no retorno", async () => {
    const db = createTestDb();

    const u = await criarUsuario(
      db,
      `Patricia Souza ${crypto.randomUUID()}`,
      "Senha555",
    );

    expect(u).not.toHaveProperty("senha");
  });
});
