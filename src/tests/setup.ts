import { beforeEach } from "bun:test";
import { createTestDb } from "../db/test-db";

let testDb: any;

beforeEach(() => {
  testDb = createTestDb();
});

export function getTestDb() {
  return testDb;
}
