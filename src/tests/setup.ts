import { beforeEach } from "bun:test";

import { createTestDb } from "../db/test-db";

let testDb: ReturnType<typeof createTestDb>;

beforeEach(() => {
  testDb = createTestDb();
});

export function getTestDb() {
  return testDb;
}
