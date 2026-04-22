import { runMigrations } from "./src/migrations";
import { db } from "./src/db";

runMigrations();

import "./src/server";

console.log("API iniciada com sucesso");
