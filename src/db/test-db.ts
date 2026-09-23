import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL não está configurada.",
  );
}

const testClient = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
  idle_timeout: 60,
  connect_timeout: 20,
  max_lifetime: 60 * 30,
  prepare: false,
});

await testClient`SET search_path TO test`;

export const testDb = drizzle(testClient);

export function createTestDb() {
  return testDb;
}

export async function closeTestDb() {
  await testClient.end({
    timeout: 5,
  });
}
