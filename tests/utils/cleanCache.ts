import {redis} from "../../src/lib/redis.js";

export async function cleanRedis() {
  await redis.flushall();
}

export async function disconnectCache() {
  await redis.quit();
}
