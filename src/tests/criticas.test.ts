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

  test("Cria crítica com sucesso", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Adilson", "123");
    const l = await criarLivro(db, "O Poder do Hábito");

    await criarCritica(db, u.id, l.id, "Bom livro", 5);

    expect(listarCriticas(db)).toHaveLength(1);
  });

  test("Crítica tem dados corretos", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "David", "1234");
    const l = await criarLivro(db, "Pai Rico");

    await criarCritica(db, u.id, l.id, "Excelente", 4);

    const c = listarCriticas(db)[0];

    expect(c).toEqual(
      expect.objectContaining({
        texto: "Excelente",
        nota: 4,
        usuario: "David",
        livro: "Pai Rico",
      })
    );
  });

  test("Lista críticas retorna array", () => {
    const db = createTestDb();
    expect(Array.isArray(listarCriticas(db))).toBeTruthy();
  });

  test("Crítica existe após criação", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Jorge", "1235");
    const l = await criarLivro(db, "O amor");

    await criarCritica(db, u.id, l.id, "Top", 5);

    const list = listarCriticas(db);

    expect(list).toContainEqual(
      expect.objectContaining({ texto: "Top" })
    );
  });

  test("Nota válida", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Dário", "1111");
    const l = await criarLivro(db, "A Guerra");

    await criarCritica(db, u.id, l.id, "OK", 3);

    const nota = listarCriticas(db)[0].nota;

    expect(nota).toBeGreaterThan(0);
    expect(nota).toBeLessThanOrEqual(5);
  });

  test("Atualiza crítica", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Simone", "3333");
    const l = await criarLivro(db, "A Felicidade");

    await criarCritica(db, u.id, l.id, "Antigo", 2);

    const c = listarCriticas(db)[0];

    await atualizarCritica(db, c.id, "Atualizado");

    expect(listarCriticas(db)[0].texto).toBe("Atualizado");
  });

  test("Remove crítica", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Diogo", "4444");
    const l = await criarLivro(db, "Havemos de Voltar");

    await criarCritica(db, u.id, l.id, "Remover", 1);

    const c = listarCriticas(db)[0];

    await deletarCritica(db, c.id);

    expect(listarCriticas(db)).toHaveLength(0);
  });

  test("Crítica não é nula", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Neto", "5555");
    const l = await criarLivro(db, "O Turismo");

    await criarCritica(db, u.id, l.id, "Teste", 4);

    expect(listarCriticas(db)[0]).toBeTruthy();
  });

  test("Retorno contém usuario e livro", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Carlos", "999");
    const l = await criarLivro(db, "Node.js");

    await criarCritica(db, u.id, l.id, "Muito bom", 5);

    const c = listarCriticas(db)[0];

    expect(c.usuario).toBe("Carlos");
    expect(c.livro).toBe("Node.js");
  });

});
