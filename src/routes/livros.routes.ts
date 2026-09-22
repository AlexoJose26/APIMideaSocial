import { Elysia } from "elysia";

import { db } from "../db/index";
import {
  criarLivro,
  listarLivros,
  buscarLivro,
  atualizarLivro,
  deletarLivro,
} from "../services/livros";

export const livrosRoutes = (app: Elysia) =>
  app


    .get("/", async () => {
      return await listarLivros(db);
    })


    .get("/:id", async ({ params }) => {
      return await buscarLivro(db, params.id);
    })


    .post("/", async ({ body }) => {
      return await criarLivro(db, body.titulo);
    })


    .put("/:id", async ({ params, body }) => {
      await atualizarLivro(db, params.id, body.titulo);

      return { message: "Atualizado" };
    })


    .delete("/:id", async ({ params }) => {
      await deletarLivro(db, params.id);

      return { message: "Removido" };
    });
