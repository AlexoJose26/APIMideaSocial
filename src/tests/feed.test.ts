import { describe, test, expect } from "bun:test";
import { createTestDb } from "../db/test-db";
import { criarPost, listarFeed } from "../services/feed";
import { criarUsuario } from "../services/usuarios";

describe("Feed - profissional", () => {

  test("Cria post", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Adilson", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db)).toHaveLength(1);
  });

  test("Contém post criado", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "David", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db)).toContainEqual(
      expect.objectContaining({
        tipo: "LOGIN",
        usuario: "David",
      })
    );
  });

  test("Usuário correto", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Jorge", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db)[0].usuario).toBe("Jorge");
  });

  test("Array válido", () => {
    const db = createTestDb();
    expect(Array.isArray(listarFeed(db))).toBeTruthy();
  });

  test("Múltiplos posts", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Dário", "123");

    await criarPost(db, u.id, "LOGIN");
    await criarPost(db, u.id, "POST");

    expect(listarFeed(db)).toHaveLength(2);
  });

  test("Tipo não vazio", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Tiago", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db)[0].tipo).toBeTruthy();
  });

  test("Usuario é string", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Diogo", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(typeof listarFeed(db)[0].usuario).toBe("string");
  });

});
