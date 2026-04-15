import { sqlite } from "./db";

export function runMigrations() {
  sqlite.exec(`
    PRAGMA foreign_keys = OFF;

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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id TEXT NOT NULL,
      livro_id TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  sqlite.exec(`
    CREATE TABLE criticas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id TEXT NOT NULL,
      livro_id TEXT NOT NULL,
      texto TEXT NOT NULL,
      nota INTEGER,
      createdAt TEXT NOT NULL
    );
  `);

  sqlite.exec(`
    CREATE TABLE feed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id TEXT NOT NULL,
      tipo TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  console.log("✅ Migrations DEV executadas com sucesso!");
}
