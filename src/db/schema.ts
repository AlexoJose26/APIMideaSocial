import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey(),

  nome: text("nome")
    .notNull()
    .unique(),

  senha: text("senha").notNull(),

  foto_perfil: text("foto_perfil"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const livros = pgTable("livros", {
  id: uuid("id").primaryKey(),

  titulo: text("titulo").notNull(),

  autor: text("autor"),

  descricao: text("descricao"),

  imagem: text("imagem"),

  googleReaderLink: text("googleReaderLink"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const criticas = pgTable("criticas", {
  id: uuid("id").primaryKey(),

  usuario_id: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, {
      onDelete: "cascade",
    }),

  livro_id: uuid("livro_id")
    .notNull()
    .references(() => livros.id, {
      onDelete: "cascade",
    }),

  texto: text("texto").notNull(),

  nota: integer("nota")
    .notNull()
    .default(0),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const estantes = pgTable(
  "estantes",
  {
    id: uuid("id").primaryKey(),

    usuario_id: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, {
        onDelete: "cascade",
      }),

    livro_id: uuid("livro_id")
      .notNull()
      .references(() => livros.id, {
        onDelete: "cascade",
      }),

    status: text("status").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    usuarioLivroUnico: unique().on(
      table.usuario_id,
      table.livro_id,
    ),
  }),
);

export const feed = pgTable("feed", {
  id: uuid("id").primaryKey(),

  usuario_id: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, {
      onDelete: "cascade",
    }),

  tipo: text("tipo").notNull(),

  conteudo: text("conteudo"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").primaryKey(),

    feed_id: uuid("feed_id")
      .notNull()
      .references(() => feed.id, {
        onDelete: "cascade",
      }),

    usuario_id: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    usuarioFeedUnico: unique().on(
      table.feed_id,
      table.usuario_id,
    ),
  }),
);

export const comentarios = pgTable("comentarios", {
  id: uuid("id").primaryKey(),

  feed_id: uuid("feed_id")
    .notNull()
    .references(() => feed.id, {
      onDelete: "cascade",
    }),

  usuario_id: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, {
      onDelete: "cascade",
    }),

  texto: text("texto").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const sessoes = pgTable("sessoes", {
  id: uuid("id").primaryKey(),

  token: text("token")
    .notNull()
    .unique(),

  usuario_id: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id, {
      onDelete: "cascade",
    }),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
