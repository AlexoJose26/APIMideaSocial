import { describe, test, expect } from "bun:test";
import { createTestDb } from "../db/test-db";
import { criarPost, listarFeed } from "../services/feed";
import { criarUsuario } from "../services/usuarios";

describe("Feed - profissional", () => {

  test("cria post no feed", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User1", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db)).toHaveLength(1);
  });

  test("feed contém item criado (toContainEqual)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User2", "123");

    await criarPost(db, u.id, "LOGIN");

    const feed = listarFeed(db);

    expect(feed).toContainEqual(
      expect.objectContaining({
        tipo: "LOGIN",
        usuario_id: u.id,
      })
    );
  });

  test("feed tem usuário válido", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User3", "123");

    await criarPost(db, u.id, "LOGIN");

    const feed = listarFeed(db);

    expect(feed[0].usuario_id).toBe(u.id);
  });

  test("feed retorna array", () => {
    const db = createTestDb();

    expect(Array.isArray(listarFeed(db))).toBeTruthy();
  });

  test("múltiplos posts funcionam corretamente", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User4", "123");

    await criarPost(db, u.id, "LOGIN");
    await criarPost(db, u.id, "POST");

    expect(listarFeed(db)).toHaveLength(2);
  });

  test("tipo do post não é vazio", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User5", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db)[0].tipo.length).toBeGreaterThan(0);
  });

  test("feed não está vazio após insert", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User6", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db).length).toBeGreaterThan(0);
  });

  test("usuario_id é string válida", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User7", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(typeof listarFeed(db)[0].usuario_id).toBe("string");
  });

  test("tipo é LOGIN válido", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User8", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db)[0].tipo).toBe("LOGIN");
  });

  test("feed não contém valores falsos (toBeTruthy)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User9", "123");

    await criarPost(db, u.id, "LOGIN");

    expect(listarFeed(db)[0].tipo).toBeTruthy();
  });
});
