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

  static async del(key: string | string[]) {
    const keys = Array.isArray(key) ? key : [key];
    await redis.del(...keys);;
  }

  static async addToList(key: string, value: unknown) {
    await redis.rpush(key, JSON.stringify(value));
  }

  static async getList(key: string) {
    return await redis.lrange(key, 0, -1);
  }

  static async addToSet(key: string, value: string, ttlSeconds=500) {
    await redis.sadd(key, value);
    await redis.expire(key, ttlSeconds);
  }

  static async removeFromSet(key: string, value: string) {
    await redis.srem(key, value);
  }

  static async getMembers(key: string) {
    return await redis.smembers(key);
  }
}
