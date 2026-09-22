import { Elysia } from "elysia";

import { db } from "../db/index";
import {
  adicionarEstante,
  listarEstante,
  atualizarStatus,
  removerEstante,
} from "../services/estantes";

export const estantesRoutes = (app: Elysia) =>
  app

    
    .get("/", async ({ query, set }) => {
      const { usuario_id } = query;

      if (!usuario_id) {
        set.status = 400;
        return { error: "usuario_id obrigatório" };
      }

      const result = listarEstante(db, usuario_id);

      return result ?? [];
    })

    .post("/", async ({ body, set }) => {
      if (!body.usuario_id || !body.livro_id || !body.status) {
        set.status = 400;
        return { error: "Dados inválidos" };
      }

      const result = await adicionarEstante(
        db,
        body.usuario_id,
        body.livro_id,
        body.status
      );

      return result;
    })


    .put("/:id", async ({ params, body, set }) => {
      const id = Number(params.id);

      if (!id) {
        set.status = 400;
        return { error: "ID inválido" };
      }

      if (!body.status) {
        set.status = 400;
        return { error: "Status obrigatório" };
      }

      await atualizarStatus(db, id, body.status);

      return { message: "Atualizado com sucesso" };
    })


    .delete("/:id", async ({ params, set }) => {
      const id = Number(params.id);

      if (!id) {
        set.status = 400;
        return { error: "ID inválido" };
      }

      await removerEstante(db, id);

      return { message: "Removido com sucesso" };
    });
