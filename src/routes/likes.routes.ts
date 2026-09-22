import { Elysia } from "elysia";

import { db } from "../db";
import {
  likePost,
  listarLikes,
  removerLike,
} from "../services/likes";

export const likesRoutes = (app: Elysia) =>
  app

 
    .post("/", async ({ body }) => {
      return await likePost(
        db,
        body.feed_id,
        body.usuario_id
      );
    })


    .get("/:feed_id", async ({ params }) => {
      return await listarLikes(db, params.feed_id);
    })


    .delete("/", async ({ body }) => {
      await removerLike(
        db,
        body.feed_id,
        body.usuario_id
      );

      return { ok: true };
    });
