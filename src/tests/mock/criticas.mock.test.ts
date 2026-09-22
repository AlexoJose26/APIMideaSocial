import {
  describe,
  test,
  expect,
  mock,
  beforeEach,
} from "bun:test";



describe("Criticas - Mocking", () => {
  let repoMock: any;

  beforeEach(() => {
    repoMock = {
      criar: mock(),
      buscar: mock(),
      atualizar: mock(),
      deletar: mock(),
    };
  });

  test("Criar Crítica", async () => {
    repoMock.criar.mockResolvedValue({
      texto: "Excelente livro",
      nota: 5,
    });

    const critica =
      await repoMock.criar();

    expect(critica.nota)
      .toBe(5);

    expect(repoMock.criar)
      .toHaveBeenCalled();
  });

  test("Validar argumentos", () => {
    repoMock.criar(
      "Ótimo livro",
      5
    );

    expect(repoMock.criar)
      .toHaveBeenCalledWith(
        "Ótimo livro",
        5
      );
  });

  test("mockReturnValue", () => {
    repoMock.buscar.mockReturnValue({
      nota: 4,
    });

    expect(
      repoMock.buscar().nota
    ).toBe(4);
  });

  test("mockResolvedValue", async () => {
    repoMock.buscar.mockResolvedValue({
      nota: 5,
    });

    const critica =
      await repoMock.buscar();

    expect(critica.nota)
      .toBe(5);
  });

  test("mockRejectedValue", async () => {
    repoMock.buscar.mockRejectedValue(
      new Error("Crítica inválida")
    );

    await expect(
      repoMock.buscar()
    ).rejects.toThrow(
      "Crítica inválida"
    );
  });

  test("mockImplementation", () => {
    repoMock.buscar.mockImplementation(
      (nota: number) =>
        nota >= 4
          ? { aprovado: true }
          : { aprovado: false }
    );

    expect(
      repoMock.buscar(5).aprovado
    ).toBeTrue();

    expect(
      repoMock.buscar(2).aprovado
    ).toBeFalse();
  });

  test("mock.calls", () => {
    repoMock.criar();
    repoMock.criar();

    expect(
      repoMock.criar.mock.calls
    ).toHaveLength(2);
  });

  test("mock.results", () => {
    repoMock.buscar.mockReturnValue({
      nota: 5,
    });

    repoMock.buscar();

    expect(
      repoMock.buscar.mock.results[0]
        ?.value?.nota
    ).toBe(5);
  });

  test("mockClear", () => {
    repoMock.criar();

    repoMock.criar.mockClear();

    expect(
      repoMock.criar.mock.calls
    ).toHaveLength(0);
  });

  test("mockReset", () => {
    repoMock.buscar.mockReset();

    expect(
      repoMock.buscar.mock.calls
    ).toHaveLength(0);
  });

  test("Falha → Sucesso", async () => {
    repoMock.criar
      .mockRejectedValueOnce(
        new Error("Erro")
      )
      .mockResolvedValueOnce({
        nota: 5,
      });

    await expect(
      repoMock.criar()
    ).rejects.toThrow();

    const critica =
      await repoMock.criar();

    expect(critica.nota)
      .toBe(5);
  });
});
