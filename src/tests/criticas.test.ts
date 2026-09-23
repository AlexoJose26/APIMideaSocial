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

describe("Criticas CRUD - PostgreSQL", () => {
  test("Cria crítica com sucesso", async () => {
    const db = createTestDb();

    const nome = `Adilson-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "O Poder do Hábito",
    );

    await criarCritica(
      db,
      u.id,
      l.id,
      "Bom livro",
      5,
    );

    const lista = await listarCriticas(db);

    expect(
      lista.some(
        (critica) =>
          critica.usuario_id === u.id &&
          critica.livro_id === l.id &&
          critica.texto === "Bom livro",
      ),
    ).toBe(true);
  });

  test("Crítica tem dados corretos", async () => {
    const db = createTestDb();

    const nome = `David-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "Pai Rico",
    );

    await criarCritica(
      db,
      u.id,
      l.id,
      "Excelente",
      4,
    );

    const lista = await listarCriticas(db);

    const c = lista.find(
      (critica) =>
        critica.usuario_id === u.id &&
        critica.livro_id === l.id,
    );

    expect(c).toBeTruthy();

    expect(c).toEqual(
      expect.objectContaining({
        texto: "Excelente",
        nota: 4,
      }),
    );

    expect(c?.usuario?.nome).toBe(nome);
    expect(c?.livro?.titulo).toBe("Pai Rico");
  });

  test("Lista críticas retorna array", async () => {
    const db = createTestDb();

    const lista = await listarCriticas(db);

    expect(Array.isArray(lista)).toBe(true);
  });

  test("Crítica existe após criação", async () => {
    const db = createTestDb();

    const nome = `Jorge-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha123",
    );

    const l = await criarLivro(
      db,
      "O amor",
    );

    await criarCritica(
      db,
      u.id,
      l.id,
      "Top",
      5,
    );

    const lista = await listarCriticas(db);

    expect(
      lista.some(
        (critica) =>
          critica.usuario_id === u.id &&
          critica.texto === "Top",
      ),
    ).toBe(true);
  });

  test("Nota válida", async () => {
    const db = createTestDb();

    const nome = `Dario-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha111",
    );

    const l = await criarLivro(
      db,
      "A Guerra",
    );

    await criarCritica(
      db,
      u.id,
      l.id,
      "OK",
      3,
    );

    const lista = await listarCriticas(db);

    const c = lista.find(
      (critica) =>
        critica.usuario_id === u.id &&
        critica.livro_id === l.id,
    );

    expect(c).toBeTruthy();
    expect(c!.nota).toBeGreaterThan(0);
    expect(c!.nota).toBeLessThanOrEqual(5);
  });

  test("Atualiza crítica", async () => {
    const db = createTestDb();

    const nome = `Simone-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha333",
    );

    const l = await criarLivro(
      db,
      "A Felicidade",
    );

    await criarCritica(
      db,
      u.id,
      l.id,
      "Antigo",
      2,
    );

    const listaAntes = await listarCriticas(db);

    const c = listaAntes.find(
      (critica) =>
        critica.usuario_id === u.id &&
        critica.livro_id === l.id,
    );

    expect(c).toBeTruthy();

    await atualizarCritica(
      db,
      c!.id,
      "Atualizado",
    );

    const listaDepois = await listarCriticas(db);

    const atualizada = listaDepois.find(
      (critica) => critica.id === c!.id,
    );

    expect(atualizada?.texto).toBe(
      "Atualizado",
    );
  });

  test("Remove crítica", async () => {
    const db = createTestDb();

    const nome = `Diogo-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha444",
    );

    const l = await criarLivro(
      db,
      "Havemos de Voltar",
    );

    await criarCritica(
      db,
      u.id,
      l.id,
      "Remover",
      1,
    );

    const listaAntes = await listarCriticas(db);

    const c = listaAntes.find(
      (critica) =>
        critica.usuario_id === u.id &&
        critica.livro_id === l.id,
    );

    expect(c).toBeTruthy();

    await deletarCritica(
      db,
      c!.id,
    );

    const listaDepois = await listarCriticas(db);

    expect(
      listaDepois.some(
        (critica) => critica.id === c!.id,
      ),
    ).toBe(false);
  });

  test("Crítica não é nula", async () => {
    const db = createTestDb();

    const nome = `Neto-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha555",
    );

    const l = await criarLivro(
      db,
      "O Turismo",
    );

    await criarCritica(
      db,
      u.id,
      l.id,
      "Teste",
      4,
    );

    const lista = await listarCriticas(db);

    const c = lista.find(
      (critica) =>
        critica.usuario_id === u.id &&
        critica.livro_id === l.id,
    );

    expect(c).toBeTruthy();
  });

  test("Retorno contém usuario e livro", async () => {
    const db = createTestDb();

    const nome = `Carlos-${crypto.randomUUID()}`;

    const u = await criarUsuario(
      db,
      nome,
      "Senha999",
    );

    const l = await criarLivro(
      db,
      "Node.js",
    );

    await criarCritica(
      db,
      u.id,
      l.id,
      "Muito bom",
      5,
    );

    const lista = await listarCriticas(db);

    const c = lista.find(
      (critica) =>
        critica.usuario_id === u.id &&
        critica.livro_id === l.id,
    );

    expect(c).toBeTruthy();

    expect(c?.usuario?.nome).toBe(nome);
    expect(c?.livro?.titulo).toBe("Node.js");
  });
});
