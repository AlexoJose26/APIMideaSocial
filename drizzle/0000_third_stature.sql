CREATE TABLE `criticas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` text NOT NULL,
	`livro_id` text NOT NULL,
	`texto` text NOT NULL,
	`nota` integer,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `estantes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` text NOT NULL,
	`livro_id` text NOT NULL,
	`status` text NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feed` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usuario_id` text NOT NULL,
	`tipo` text NOT NULL,
	`createdAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `livros` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`autor` text,
	`descricao` text
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`senha` text NOT NULL,
	`foto_perfil` text
);
