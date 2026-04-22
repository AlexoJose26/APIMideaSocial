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

  test("adiciona livro na estante", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User1", "1");
    const l = await criarLivro(db, "Livro1");

    await adicionarEstante(db, u.id, l.id, "lendo");

    expect(listarEstante(db, u.id)).toHaveLength(1);
  });

  test("lista estante não vazia", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User2", "1");
    const l = await criarLivro(db, "Livro2");

    await adicionarEstante(db, u.id, l.id, "lendo");

    expect(listarEstante(db, u.id).length).toBeGreaterThan(0);
  });

  test("status é lido corretamente", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User3", "1");
    const l = await criarLivro(db, "Livro3");

    await adicionarEstante(db, u.id, l.id, "lido");

    const estante = listarEstante(db, u.id);

    expect(estante[0].status).toBe("lido");
  });

  test("status não é vazio (toBeTruthy)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User4", "1");
    const l = await criarLivro(db, "Livro4");

    await adicionarEstante(db, u.id, l.id, "lendo");

    expect(listarEstante(db, u.id)[0].status).toBeTruthy();
  });

  test("estrutura contém usuario_id (toHaveProperty)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User5", "1");
    const l = await criarLivro(db, "Livro5");

    await adicionarEstante(db, u.id, l.id, "lendo");

    const estante = listarEstante(db, u.id);

    expect(estante[0]).toHaveProperty("usuario_id");
    expect(estante[0]).toHaveProperty("livro_id");
  });

  test("atualiza status com sucesso", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User6", "1");
    const l = await criarLivro(db, "Livro6");

    await adicionarEstante(db, u.id, l.id, "lendo");

    const estante = listarEstante(db, u.id);

    await atualizarStatus(db, estante[0].id, "lido");

    const updated = listarEstante(db, u.id);

    expect(updated[0].status).toBe("lido");
  });

  test("remove estante corretamente", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User7", "1");
    const l = await criarLivro(db, "Livro7");

    await adicionarEstante(db, u.id, l.id, "lendo");

    const estante = listarEstante(db, u.id);

    await removerEstante(db, estante[0].id);

    expect(listarEstante(db, u.id)).toHaveLength(0);
  });

  test("lista retorna array válido", () => {
    const db = createTestDb();

    expect(Array.isArray(listarEstante(db, "fake"))).toBeTruthy();
  });

  test("usuário válido existe", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User8", "1");

    expect(u.id).toBeTruthy();
  });

  test("livro válido existe", async () => {
    const db = createTestDb();

    const l = await criarLivro(db, "Livro8");

    expect(l.titulo).toBeTruthy();
  });

  test("não contém estante inexistente (toContainEqual)", async () => {
    const db = createTestDb();

    const u = await criarUsuario(db, "User9", "1");
    const l = await criarLivro(db, "Livro9");

    await adicionarEstante(db, u.id, l.id, "lendo");

    const list = listarEstante(db, u.id);

    expect(list).toContainEqual(
      expect.objectContaining({
        status: "lendo",
        usuario_id: u.id,
        livro_id: l.id,
      })
    );
  });
});
