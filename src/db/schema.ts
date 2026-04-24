import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";


export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  senha: text("senha").notNull(),
  foto_perfil: text("foto_perfil"),
});

export const livros = sqliteTable("livros", {
  id: text("id").primaryKey(),
  titulo: text("titulo").notNull(),
  autor: text("autor"),
  descricao: text("descricao"),
});

export const criticas = sqliteTable("criticas", {
  id: text("id").primaryKey(),
  usuario_id: text("usuario_id").notNull(),
  livro_id: text("livro_id").notNull(),
  texto: text("texto").notNull(),
  nota: integer("nota").notNull(),
  createdAt: text("createdAt").notNull(),
});

export const estantes = sqliteTable("estantes", {
  id: text("id").primaryKey(),
  usuario_id: text("usuario_id").notNull(),
  livro_id: text("livro_id").notNull(),
  status: text("status").notNull(),
  createdAt: text("createdAt").notNull(),
});


export const feed = sqliteTable("feed", {
  id: text("id").primaryKey(),
  usuario_id: text("usuario_id").notNull(),
  tipo: text("tipo").notNull(),
  createdAt: text("createdAt").notNull(),
});

export const likes = sqliteTable("likes", {
  id: text("id").primaryKey(),
  feed_id: text("feed_id").notNull(),
  usuario_id: text("usuario_id").notNull(),
});


export const comentarios = sqliteTable("comentarios", {
  id: text("id").primaryKey(),
  feed_id: text("feed_id").notNull(),
  usuario_id: text("usuario_id").notNull(),
  texto: text("texto").notNull(),
  createdAt: text("createdAt").notNull(),
});
