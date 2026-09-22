import { Elysia } from "elysia";

import { db } from "../db/index";
import { criarPost, listarFeed } from "../services/feed";

export const feedRoutes = (app: Elysia) =>
  app

   
    .get("/", async () => {
      return await listarFeed(db);
    })


    .post("/", async ({ body }) => {
      const post = await criarPost(
        db,
        body.usuario_id,
        body.tipo
      );

      return post;
    });
