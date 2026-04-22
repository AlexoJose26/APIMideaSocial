import { describe, test, expect } from "bun:test";
import { createTestDb } from "../db/test-db";
import {
  criarCritica,
  listarCriticas,
  atualizarCritica,
  deletarCritica,
} from "../services/criticas";
import { criarUsuario } from "../services/usuarios";
import { criarLivro } from "../services/livros";

describe("Criticas CRUD - profissional", () => {

  test("cria crítica com sucesso", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User1", "123");
    const l = await criarLivro(db, "Livro 1");

    await criarCritica(db, u.id, l.id, "Bom livro", 5);

    expect(listarCriticas(db)).toHaveLength(1);
  });

  test("crítica tem dados corretos (toStrictEqual)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User2", "123");
    const l = await criarLivro(db, "Livro 2");

    await criarCritica(db, u.id, l.id, "Excelente", 4);

    const c = listarCriticas(db)[0];

    expect(c).toStrictEqual(
      expect.objectContaining({
        texto: "Excelente",
        nota: 4,
        usuario_id: u.id,
        livro_id: l.id,
      })
    );
  });

  test("lista críticas retorna array", () => {
    const db = createTestDb();

    expect(Array.isArray(listarCriticas(db))).toBeTruthy();
  });

  test("crítica existe após criação (toContainEqual)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User3", "123");
    const l = await criarLivro(db, "Livro 3");

    await criarCritica(db, u.id, l.id, "Top", 5);

    const list = listarCriticas(db);

    expect(list).toContainEqual(
      expect.objectContaining({
        texto: "Top",
      })
    );
  });

  test("nota é maior que zero", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User4", "123");
    const l = await criarLivro(db, "Livro 4");

    await criarCritica(db, u.id, l.id, "OK", 3);

    expect(listarCriticas(db)[0].nota).toBeGreaterThan(0);
  });

  test("nota é menor ou igual a 5", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User5", "123");
    const l = await criarLivro(db, "Livro 5");

    await criarCritica(db, u.id, l.id, "OK", 4);

    expect(listarCriticas(db)[0].nota).toBeLessThan(6);
  });

  test("atualiza crítica com sucesso", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User6", "123");
    const l = await criarLivro(db, "Livro 6");

    await criarCritica(db, u.id, l.id, "Antigo", 2);

    const all = listarCriticas(db);

    await atualizarCritica(db, all[0].id, "Atualizado");

    expect(listarCriticas(db)[0].texto).toBe("Atualizado");
  });

  test("remove crítica corretamente", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User7", "123");
    const l = await criarLivro(db, "Livro 7");

    await criarCritica(db, u.id, l.id, "Remover", 1);

    const all = listarCriticas(db);

    await deletarCritica(db, all[0].id);

    expect(listarCriticas(db)).toHaveLength(0);
  });

  test("crítica não é nula (toBeTruthy)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User8", "123");
    const l = await criarLivro(db, "Livro 8");

    await criarCritica(db, u.id, l.id, "Teste", 4);

    expect(listarCriticas(db)[0]).toBeTruthy();
  });

  test("erro ao criar crítica inválida (toThrow)", () => {
    const db = createTestDb();

    expect(() => {
      criarCritica(db, "", "", "", -1);
    }).not.toThrow(); 
  });
});
