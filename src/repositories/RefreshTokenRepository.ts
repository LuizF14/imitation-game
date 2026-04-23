import { Cache } from "./cache/Cache.js";

export class RefreshTokenRepository {
    private static CACHE_PREFIX = "refreshtoken";

    static async create(jti: string, userId: string) {
        const key = `${this.CACHE_PREFIX}:${jti}`;

        await Cache.set(key, {userId: userId}, 60 * 60 * 24 * 7);
    }

    static async find(jti: string) {
        const key = `${this.CACHE_PREFIX}:${jti}`;

        return await Cache.get(key);
    }

    static async delete(jti: string) {
        const key = `${this.CACHE_PREFIX}:${jti}`;

        await Cache.del(key);
    }

    static async exists(jti: string) {
        const key = `${this.CACHE_PREFIX}:${jti}`;

        const value = await Cache.get(key);
        return value !== null;
    }

}