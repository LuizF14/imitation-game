import { cleanDatabase, disconnectDB } from "./utils/cleanDB.js";
import { cleanRedis, disconnectCache } from "./utils/cleanCache.js";

beforeEach(async () => {
  await cleanDatabase();
  await cleanRedis();
});

afterAll(async () => {
  await disconnectCache();
  await disconnectDB();
});
