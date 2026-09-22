import { Elysia } from "elysia";

import { db } from "../db";
import {
  criarComentario,
  listarComentarios,
  deletarComentario,
} from "../services/comentarios";

export const comentariosRoutes = (app: Elysia) =>
  app

   
    .post("/", async ({ body }) => {
      return await criarComentario(
        db,
        body.feed_id,
        body.usuario_id,
        body.texto
      );
    })


    .get("/:feed_id", async ({ params }) => {
      return await listarComentarios(db, params.feed_id);
    })

    .delete("/", async ({ body }) => {
      await deletarComentario(db, body.id);
      return { ok: true };
    });
