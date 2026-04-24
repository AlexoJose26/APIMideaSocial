import { Database } from "bun:sqlite";

export function runMigrations(sqlite: Database) {
  sqlite.exec(`
    PRAGMA foreign_keys = OFF;

    DROP TABLE IF EXISTS comentarios;
    DROP TABLE IF EXISTS likes;
    DROP TABLE IF EXISTS feed;
    DROP TABLE IF EXISTS criticas;
    DROP TABLE IF EXISTS estantes;
    DROP TABLE IF EXISTS livros;
    DROP TABLE IF EXISTS usuarios;

    PRAGMA foreign_keys = ON;
  `);

 
  sqlite.exec(`
    CREATE TABLE usuarios (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      senha TEXT NOT NULL,
      foto_perfil TEXT
    );
  `);


  sqlite.exec(`
    CREATE TABLE livros (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      autor TEXT,
      descricao TEXT
    );
  `);

  sqlite.exec(`
    CREATE TABLE estantes (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      livro_id TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  sqlite.exec(`
    CREATE TABLE criticas (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      livro_id TEXT NOT NULL,
      texto TEXT NOT NULL,
      nota INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );
  `);


  sqlite.exec(`
    CREATE TABLE feed (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      conteudo TEXT,
      createdAt TEXT NOT NULL
    );
  `);


  sqlite.exec(`
    CREATE TABLE likes (
      id TEXT PRIMARY KEY,
      feed_id TEXT NOT NULL,
      usuario_id TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);


  sqlite.exec(`
    CREATE TABLE comentarios (
      id TEXT PRIMARY KEY,
      feed_id TEXT NOT NULL,
      usuario_id TEXT NOT NULL,
      texto TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  console.log("Migrations executadas com sucesso");
}
