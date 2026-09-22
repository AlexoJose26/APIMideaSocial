import { Elysia } from "elysia";

import { db } from "../db/index";
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../services/usuarios";

export const usuariosRoutes = (app: Elysia) =>
  app

  
    .get("/", async () => {
      return await listarUsuarios(db);
    })


    .get("/:id", async ({ params }) => {
      return await buscarUsuario(db, params.id);
    })


    .post("/", async ({ body }) => {
      const user = await criarUsuario(
        db,
        body.nome,
        body.senha
      );

      return user;
    })


    .put("/:id", async ({ params, body }) => {
      await atualizarUsuario(
        db,
        params.id,
        body.nome
      );

      return { message: "Atualizado" };
    })


    .delete("/:id", async ({ params }) => {
      await deletarUsuario(db, params.id);

      return { message: "Removido" };
    });
