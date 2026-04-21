import { redis } from "../../lib/redis.js";

export class Cache {
  static async get(key: string): Promise<any | null> {
    const data = await redis.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static async set(key: string, value: unknown, ttlSeconds = 60) {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  static async del(key: string) {
    await redis.del(key);
  }

  static async addToList(key: string, value: unknown) {
    await redis.rpush(key, JSON.stringify(value));
  }

  static async getList(key: string) {
    return await redis.lrange(key, 0, -1);
  }
}
