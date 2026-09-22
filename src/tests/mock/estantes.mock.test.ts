import {
  describe,
  test,
  expect,
  mock,
  beforeEach,
} from "bun:test";






describe("Estantes - Mocking", () => {
  let repoMock: any;

  beforeEach(() => {
    repoMock = {
      adicionar: mock(),
      listar: mock(),
      atualizar: mock(),
      remover: mock(),
    };
  });

  test("Adicionar livro", async () => {
    repoMock.adicionar.mockResolvedValue({
      status: "Lendo",
    });

    const item =
      await repoMock.adicionar();

    expect(item.status)
      .toBe("Lendo");
  });

  test("Atualizar status", async () => {
    repoMock.atualizar.mockResolvedValue({
      status: "Lido",
    });

    const item =
      await repoMock.atualizar();

    expect(item.status)
      .toBe("Lido");
  });

  test("toHaveBeenCalledWith", () => {
    repoMock.adicionar(
      "Livro",
      "Lendo"
    );

    expect(repoMock.adicionar)
      .toHaveBeenCalledWith(
        "Livro",
        "Lendo"
      );
  });

  test("mockImplementation", () => {
    repoMock.atualizar.mockImplementation(
      (status: string) => ({
        status,
      })
    );

    expect(
      repoMock.atualizar("Lido").status
    ).toBe("Lido");
  });

  test("mock.calls", () => {
    repoMock.adicionar();
    repoMock.adicionar();

    expect(
      repoMock.adicionar.mock.calls
    ).toHaveLength(2);
  });

  test("mock.results", () => {
    repoMock.adicionar.mockReturnValue({
      status: "Lendo",
    });

    repoMock.adicionar();

    expect(
      repoMock.adicionar.mock.results[0]
        ?.value?.status
    ).toBe("Lendo");
  });

  test("mockRejectedValue", async () => {
    repoMock.adicionar.mockRejectedValue(
      new Error("Estante cheia")
    );

    await expect(
      repoMock.adicionar()
    ).rejects.toThrow(
      "Estante cheia"
    );
  });

  test("mockClear", () => {
    repoMock.adicionar();

    repoMock.adicionar.mockClear();

    expect(
      repoMock.adicionar.mock.calls
    ).toHaveLength(0);
  });

  test("mockReset", () => {
    repoMock.adicionar.mockReset();

    expect(
      repoMock.adicionar.mock.calls
    ).toHaveLength(0);
  });
});
