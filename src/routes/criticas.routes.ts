import { Elysia } from "elysia";

import { db } from "../db/index";
import {
  criarCritica,
  listarCriticas,
  atualizarCritica,
  deletarCritica,
} from "../services/criticas";

export const criticasRoutes = (app: Elysia) =>
  app


    .get("/", async () => {
      return await listarCriticas(db);
    })


    .post("/", async ({ body }) => {
      const result = await criarCritica(
        db,
        body.usuario_id,
        body.livro_id,
        body.texto,
        body.nota
      );

      return result;
    })


    .put("/:id", async ({ params, body, set }) => {
      const id = Number(params.id);

      if (!id) {
        set.status = 400;
        return { error: "ID inválido" };
      }

      await atualizarCritica(db, id, body.texto);

      return { message: "Crítica atualizada" };
    })

    .delete("/:id", async ({ params, set }) => {
      const id = Number(params.id);

      if (!id) {
        set.status = 400;
        return { error: "ID inválido" };
      }

      await deletarCritica(db, id);

      return { message: "Crítica removida" };
    });
