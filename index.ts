import { runMigrations } from "./src/migrations";
import { sqlite } from "./src/db";

runMigrations(sqlite);

import "./src/server";

console.log("API iniciada com sucesso");
