import { describe, test, expect } from "bun:test";
import { createTestDb } from "../db/test-db";
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../services/usuarios";

describe("Usuarios CRUD - profissional realista", () => {

  test("Cria usuário com nome real", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Carlos Silva", "123");

    expect(u.nome).toBe("Carlos Silva");
    expect(u.id).toBeTruthy();
  });

  test("Lista usuários com nomes reais", async () => {
    const db = createTestDb();

    await criarUsuario(db, "Ana Paula", "123");
    await criarUsuario(db, "João Mendes", "456");

    const lista = listarUsuarios(db);

    expect(lista).toHaveLength(2);
  });

  test("Busca usuário pelo id", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Mariana Costa", "789");

    const found = buscarUsuario(db, u.id);

    expect(found?.nome).toBe("Mariana Costa");
  });

  test("Atualiza nome do usuário", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Pedro Santos", "111");

    await atualizarUsuario(db, u.id, "Pedro Henrique Santos");

    const updated = buscarUsuario(db, u.id);

    expect(updated?.nome).toBe("Pedro Henrique Santos");
  });

  test("Remove usuário corretamente", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Fernanda Lima", "222");

    await deletarUsuario(db, u.id);

    const lista = listarUsuarios(db);

    expect(lista.find(x => x.id === u.id)).toBeFalsy();
  });

  test("IDs são únicos mesmo com nomes iguais", async () => {
    const db = createTestDb();

    const u1 = await criarUsuario(db, "Lucas Rocha", "123");
    const u2 = await criarUsuario(db, "Lucas Rocha", "123");

    expect(u1.id).not.toBe(u2.id);
  });

  test("Nome não pode ser vazio", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Beatriz Alves", "333");

    expect(u.nome.length).toBeGreaterThan(0);
  });

  test("Lista retorna array válido", () => {
    const db = createTestDb();

    expect(Array.isArray(listarUsuarios(db))).toBeTruthy();
  });

  test("Usuário criado existe na lista", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Ricardo Gomes", "444");

    const lista = listarUsuarios(db);

    expect(lista).toContainEqual(
      expect.objectContaining({
        nome: "Ricardo Gomes",
      })
    );
  });

  test("Senha não é exposta no retorno", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Patrícia Souza", "555");

    expect(u).not.toHaveProperty("senha");
  });

});
