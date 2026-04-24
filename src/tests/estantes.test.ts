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

describe("Estantes CRUD - profissional", () => {

  test("Adiciona livro", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Adilson", "123");
    const l = await criarLivro(db, "Livro");

    await adicionarEstante(db, u.id, l.id, "Lendo");

    expect(listarEstante(db, u.id)).toHaveLength(1);
  });

  test("Lista não vazia", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "David", "123");
    const l = await criarLivro(db, "Pai Rico");

    await adicionarEstante(db, u.id, l.id, "Lendo");

    expect(listarEstante(db, u.id).length).toBeGreaterThan(0);
  });

  test("Status correto", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Jorge", "123");
    const l = await criarLivro(db, "Livro");

    await adicionarEstante(db, u.id, l.id, "Lido");

    expect(listarEstante(db, u.id)[0].status).toBe("Lido");
  });

  test("Estrutura contém usuario e livro", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Tiago", "123");
    const l = await criarLivro(db, "Livro");

    await adicionarEstante(db, u.id, l.id, "Lendo");

    const e = listarEstante(db, u.id)[0];

    expect(e).toHaveProperty("usuario");
    expect(e).toHaveProperty("livro");
  });

  test("Atualiza status", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Simone", "123");
    const l = await criarLivro(db, "Livro");

    await adicionarEstante(db, u.id, l.id, "Lendo");

    const e = listarEstante(db, u.id)[0];

    await atualizarStatus(db, e.id, "Lido");

    expect(listarEstante(db, u.id)[0].status).toBe("Lido");
  });

  test("Remove estante", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Diogo", "123");
    const l = await criarLivro(db, "Livro");

    await adicionarEstante(db, u.id, l.id, "Lendo");

    const e = listarEstante(db, u.id)[0];

    await removerEstante(db, e.id);

    expect(listarEstante(db, u.id)).toHaveLength(0);
  });

  test("Retorno contém dados corretos", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "Gustavo", "123");
    const l = await criarLivro(db, "IA");

    await adicionarEstante(db, u.id, l.id, "Lendo");

    const e = listarEstante(db, u.id)[0];

    expect(e.usuario).toBe("Gustavo");
    expect(e.livro).toBe("IA");
  });

});
