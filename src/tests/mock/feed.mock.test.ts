import {
  describe,
  test,
  expect,
  mock,
  beforeEach,
} from "bun:test";





describe("Feed - Mocking", () => {
  let repoMock: any;

  beforeEach(() => {
    repoMock = {
      criarPost: mock(),
      listar: mock(),
    };
  });

  test("Criar post", async () => {
    repoMock.criarPost.mockResolvedValue({
      tipo: "LOGIN",
      usuario: "Carlos",
    });

    const post =
      await repoMock.criarPost();

    expect(post.tipo)
      .toBe("LOGIN");
  });

  test("Usuário correto", async () => {
    repoMock.criarPost.mockResolvedValue({
      usuario: "Adilson",
    });

    const post =
      await repoMock.criarPost();

    expect(post.usuario)
      .toBe("Adilson");
  });

  test("toHaveBeenCalledTimes", () => {
    repoMock.criarPost();
    repoMock.criarPost();
    repoMock.criarPost();

    expect(repoMock.criarPost)
      .toHaveBeenCalledTimes(3);
  });

  test("mockReturnValue", () => {
    repoMock.criarPost.mockReturnValue({
      tipo: "POST",
    });

    expect(
      repoMock.criarPost().tipo
    ).toBe("POST");
  });

  test("mockReturnValueOnce", () => {
    repoMock.criarPost
      .mockReturnValueOnce({
        tipo: "LOGIN",
      })
      .mockReturnValueOnce({
        tipo: "POST",
      });

    expect(
      repoMock.criarPost().tipo
    ).toBe("LOGIN");

    expect(
      repoMock.criarPost().tipo
    ).toBe("POST");
  });

  test("mockRejectedValue", async () => {
    repoMock.criarPost.mockRejectedValue(
      new Error("Feed indisponível")
    );

    await expect(
      repoMock.criarPost()
    ).rejects.toThrow(
      "Feed indisponível"
    );
  });

  test("mock.calls", () => {
    repoMock.criarPost("LOGIN");
    repoMock.criarPost("POST");

    expect(
      repoMock.criarPost.mock.calls
    ).toHaveLength(2);
  });

  test("mock.results", () => {
    repoMock.criarPost.mockReturnValue({
      tipo: "LOGIN",
    });

    repoMock.criarPost();

    expect(
      repoMock.criarPost.mock.results[0]
        ?.value?.tipo
    ).toBe("LOGIN");
  });

  test("Falha → Sucesso", async () => {
    repoMock.criarPost
      .mockRejectedValueOnce(
        new Error("Erro")
      )
      .mockResolvedValueOnce({
        tipo: "LOGIN",
      });

    await expect(
      repoMock.criarPost()
    ).rejects.toThrow();

    const post =
      await repoMock.criarPost();

    expect(post.tipo)
      .toBe("LOGIN");
  });
});
