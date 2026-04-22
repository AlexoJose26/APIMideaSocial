import { describe, test, expect } from "bun:test";
import { createTestDb } from "../db/test-db";
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../services/usuarios";

describe("Usuarios CRUD - profissional", () => {

  test("cria usuário com sucesso", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "José", "123");

    expect(u.nome).toBe("José");
    expect(u.id).toBeTruthy();
  });

  test("lista usuários corretamente", async () => {
    const db = createTestDb();

    await criarUsuario(db, "A", "1");

    expect(listarUsuarios(db)).toHaveLength(1);
  });

  test("lista retorna array válido", () => {
    const db = createTestDb();

    expect(Array.isArray(listarUsuarios(db))).toBeTruthy();
  });

  test("busca usuário por id", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "B", "1");

    const found = buscarUsuario(db, u.id);

    expect(found?.id).toBe(u.id);
    expect(found?.nome).toBe("B");
  });

  test("usuário existe após criação (toContainEqual)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "C", "1");

    const list = listarUsuarios(db);

    expect(list).toContainEqual(
      expect.objectContaining({
        id: u.id,
        nome: "C",
      })
    );
  });

  test("atualiza usuário com sucesso", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "D", "1");

    await atualizarUsuario(db, u.id, "NovoNome");

    const updated = buscarUsuario(db, u.id);

    expect(updated?.nome).toBe("NovoNome");
  });

  test("remove usuário corretamente", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "E", "1");

    await deletarUsuario(db, u.id);

    const list = listarUsuarios(db);

    expect(list.find(x => x.id === u.id)).toBeFalsy();
  });

  test("id é string válida", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "F", "1");

    expect(typeof u.id).toBe("string");
  });

  test("nome não é vazio", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "G", "1");

    expect(u.nome.length).toBeGreaterThan(0);
  });

  test("usuários não duplicam IDs", async () => {
    const db = createTestDb();

    const u1 = await criarUsuario(db, "H", "1");
    const u2 = await criarUsuario(db, "H", "1");

    expect(u1.id).not.toBe(u2.id);
  });

  test("senha não aparece no retorno público (segurança básica)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "I", "123");

    expect(u).not.toHaveProperty("senha");
  });
});
