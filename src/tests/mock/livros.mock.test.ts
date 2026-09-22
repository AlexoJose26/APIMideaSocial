import {
  describe,
  test,
  expect,
  mock,
  beforeEach,
} from "bun:test";








describe("Livros - Mocking", () => {
  let repoMock: any;

  beforeEach(() => {
    repoMock = {
      criar: mock(),
      buscar: mock(),
      atualizar: mock(),
      deletar: mock(),
    };
  });

  test("Criar livro", async () => {
    repoMock.criar.mockResolvedValue({
      id: "1",
      titulo: "Pai Rico Pai Pobre",
    });

    const livro = await repoMock.criar();

    expect(livro.titulo)
      .toBe("Pai Rico Pai Pobre");

    expect(repoMock.criar)
      .toHaveBeenCalled();
  });

  test("Buscar livro com argumento correto", () => {
    repoMock.buscar("10");

    expect(repoMock.buscar)
      .toHaveBeenCalledWith("10");
  });

  test("Contar chamadas", () => {
    repoMock.buscar();
    repoMock.buscar();

    expect(repoMock.buscar)
      .toHaveBeenCalledTimes(2);
  });

  test("Nunca chamado", () => {
    expect(repoMock.deletar)
      .not.toHaveBeenCalled();
  });

  test("mockReturnValue", () => {
    repoMock.buscar.mockReturnValue({
      titulo: "Hábitos Atômicos",
    });

    expect(
      repoMock.buscar().titulo
    ).toBe("Hábitos Atômicos");
  });

  test("mockReturnValueOnce", () => {
    repoMock.buscar
      .mockReturnValueOnce({
        titulo: "Livro A",
      })
      .mockReturnValueOnce({
        titulo: "Livro B",
      });

    expect(
      repoMock.buscar().titulo
    ).toBe("Livro A");

    expect(
      repoMock.buscar().titulo
    ).toBe("Livro B");
  });

  test("mockResolvedValue", async () => {
    repoMock.buscar.mockResolvedValue({
      titulo: "Mindset",
    });

    const livro =
      await repoMock.buscar();

    expect(livro.titulo)
      .toBe("Mindset");
  });

  test("mockRejectedValue", async () => {
    repoMock.buscar.mockRejectedValue(
      new Error("Livro não encontrado")
    );

    await expect(
      repoMock.buscar()
    ).rejects.toThrow(
      "Livro não encontrado"
    );
  });

  test("mockImplementation", () => {
    repoMock.buscar.mockImplementation(
      (id: string) =>
        id === "1"
          ? { id, titulo: "Essencialismo" }
          : null
    );

    expect(
      repoMock.buscar("1").titulo
    ).toBe("Essencialismo");

    expect(
      repoMock.buscar("99")
    ).toBeNull();
  });

  test("mock.calls", () => {
    repoMock.criar("Livro A");
    repoMock.criar("Livro B");

    expect(
      repoMock.criar.mock.calls
    ).toHaveLength(2);
  });

  test("mock.results", () => {
    repoMock.buscar.mockReturnValue({
      titulo: "Livro Teste",
    });

    repoMock.buscar();

    expect(
      repoMock.buscar.mock.results[0]
        ?.value?.titulo
    ).toBe("Livro Teste");
  });

  test("mockClear", () => {
    repoMock.criar();

    repoMock.criar.mockClear();

    expect(
      repoMock.criar.mock.calls
    ).toHaveLength(0);
  });

  test("mockReset", () => {
    repoMock.buscar.mockReturnValue({
      titulo: "Teste",
    });

    repoMock.buscar.mockReset();

    expect(
      repoMock.buscar.mock.calls
    ).toHaveLength(0);
  });

  test("Falha → Sucesso", async () => {
    repoMock.buscar
      .mockRejectedValueOnce(
        new Error("Erro")
      )
      .mockResolvedValueOnce({
        titulo: "Livro Recuperado",
      });

    await expect(
      repoMock.buscar()
    ).rejects.toThrow();

    const livro =
      await repoMock.buscar();

    expect(livro.titulo)
      .toBe("Livro Recuperado");
  });
});
