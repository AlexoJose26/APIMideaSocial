import { describe,expect, test } from "bun:test";
import { testDb } from "../db/test-db";
import { usuarios } from "../db/schema";
import { randomUUID } from "crypto";

describe("Usuarios API", () => {
  test("deve criar usuário", async () => {
    const id = randomUUID();

    await testDb.insert(usuarios).values({
      id,
      nome: "Alexo",
      senha: "123",
    });

    const result = testDb.select().from(usuarios).all();

    expect(result.length).toBe(1);
  });
});
