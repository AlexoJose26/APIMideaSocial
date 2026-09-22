import {
  describe,
  test,
  expect,
  mock,
  spyOn,
  beforeEach,
} from "bun:test";







describe("Usuarios - Mocking", () => {
  let repoMock: any;

  beforeEach(() => {
    repoMock = {
      criar: mock(),
      buscar: mock(),
      atualizar: mock(),
      deletar: mock(),
    };

    repoMock.criar.mockClear();
    repoMock.buscar.mockClear();
    repoMock.atualizar.mockClear();
    repoMock.deletar.mockClear();
  });

  test("Criar usuário", async () => {
    repoMock.criar.mockResolvedValue({
      id: "1",
      nome: "Carlos",
    });

    const usuario = await repoMock.criar("Carlos");

    expect(usuario.nome).toBe("Carlos");

    expect(repoMock.criar)
      .toHaveBeenCalled();

    expect(repoMock.criar)
      .toHaveBeenCalledWith("Carlos");
  });

  test("Contar chamadas", () => {
    repoMock.buscar();
    repoMock.buscar();
    repoMock.buscar();

    expect(repoMock.buscar)
      .toHaveBeenCalledTimes(3);
  });

  test("Não foi chamado", () => {
    expect(repoMock.deletar)
      .not.toHaveBeenCalled();
  });

  test("mockReturnValue", () => {
    repoMock.buscar.mockReturnValue({
      id: "10",
      nome: "Ana",
    });

    const usuario = repoMock.buscar();

    expect(usuario.nome)
      .toBe("Ana");
  });

  test("mockReturnValueOnce", () => {
    repoMock.buscar
      .mockReturnValueOnce({
        nome: "Primeiro",
      })
      .mockReturnValueOnce({
        nome: "Segundo",
      });

    expect(
      repoMock.buscar().nome
    ).toBe("Primeiro");

    expect(
      repoMock.buscar().nome
    ).toBe("Segundo");
  });

  test("mockResolvedValue", async () => {
    repoMock.buscar.mockResolvedValue({
      nome: "João",
    });

    const usuario =
      await repoMock.buscar();

    expect(usuario.nome)
      .toBe("João");
  });

  test("mockRejectedValue", async () => {
    repoMock.buscar.mockRejectedValue(
      new Error(
        "Usuário não encontrado"
      )
    );

    await expect(
      repoMock.buscar()
    ).rejects.toThrow(
      "Usuário não encontrado"
    );
  });

  test("mockImplementation", () => {
    repoMock.buscar.mockImplementation(
      (id: string) => {
        if (id === "1") {
          return {
            id,
            nome: "Carlos",
          };
        }

        return null;
      }
    );

    expect(
      repoMock.buscar("1").nome
    ).toBe("Carlos");

    expect(
      repoMock.buscar("999")
    ).toBeNull();
  });

  test("mock.calls", () => {
    repoMock.criar("Carlos");
    repoMock.criar("Ana");

    expect(
      repoMock.criar.mock.calls
    ).toHaveLength(2);

    expect(
      repoMock.criar.mock.calls[0]
    ).toEqual(["Carlos"]);

    expect(
      repoMock.criar.mock.calls[1]
    ).toEqual(["Ana"]);
  });

  test("mock.results", () => {
    repoMock.buscar.mockReturnValue({
      nome: "Carlos",
    });

    repoMock.buscar();

    expect(
      repoMock.buscar.mock.results[0]
        ?.value?.nome
    ).toBe("Carlos");
  });

  test("mockClear", () => {
    repoMock.criar();

    expect(
      repoMock.criar.mock.calls
    ).toHaveLength(1);

    repoMock.criar.mockClear();

    expect(
      repoMock.criar.mock.calls
    ).toHaveLength(0);
  });

  test("mockReset", () => {
    repoMock.buscar.mockReturnValue({
      nome: "Carlos",
    });

    repoMock.buscar.mockReset();

    expect(
      repoMock.buscar.mock.calls
    ).toHaveLength(0);
  });

  test("Sequência falha → sucesso", async () => {
    repoMock.buscar
      .mockRejectedValueOnce(
        new Error("Falha")
      )
      .mockResolvedValueOnce({
        nome: "Carlos",
      });

    await expect(
      repoMock.buscar()
    ).rejects.toThrow();

    const usuario =
      await repoMock.buscar();

    expect(usuario.nome)
      .toBe("Carlos");
  });
});

describe("SpyOn - Usuários", () => {
  test("Observa Math.random", () => {
    const spy =
      spyOn(Math, "random");

    Math.random();

    expect(spy)
      .toHaveBeenCalled();

    spy.mockRestore();
  });

  test("Controlar retorno", () => {
    const spy =
      spyOn(Math, "random");

    spy.mockReturnValue(0.5);

    expect(
      Math.random()
    ).toBe(0.5);

    spy.mockRestore();
  });
});

describe("Mocking de Tempo", () => {

  test("Congela relógio usando spyOn", () => {
    const data = new Date(
      "2025-01-01T10:00:00Z"
    );

    const spy =
      spyOn(Date, "now");

    spy.mockReturnValue(
      data.getTime()
    );

    expect(
      Date.now()
    ).toBe(data.getTime());

    spy.mockRestore();
  });

  test("Validar token expirado", () => {
    const agora = new Date(
      "2025-01-01T10:00:00Z"
    );

    const spy =
      spyOn(Date, "now");

    spy.mockReturnValue(
      agora.getTime()
    );

    const expiracao = new Date(
      "2024-12-31T23:59:59Z"
    );

    const expirado =
      expiracao.getTime() <
      Date.now();

    expect(expirado)
      .toBe(true);

    spy.mockRestore();
  });

  test("Validar token ainda válido", () => {
    const agora = new Date(
      "2025-01-01T10:00:00Z"
    );

    const spy =
      spyOn(Date, "now");

    spy.mockReturnValue(
      agora.getTime()
    );

    const expiracao = new Date(
      "2025-01-02T10:00:00Z"
    );

    const expirado =
      expiracao.getTime() <
      Date.now();

    expect(expirado)
      .toBe(false);

    spy.mockRestore();
  });

});
