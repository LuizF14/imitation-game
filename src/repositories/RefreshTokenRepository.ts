import { Cache } from "./cache/Cache.js";

export class RefreshTokenRepository {
    private static CACHE_PREFIX = "refreshtoken";

    static async create(jti: string, userId: string) {
        const tokenKey = `${this.CACHE_PREFIX}:${jti}`;
        const userKey = `user_tokens:${userId}`;

        await Cache.set(tokenKey, {userId: userId}, 60 * 60 * 24 * 7);
        await Cache.addToSet(userKey, jti, 60 * 60 * 24 * 7);
    }

    static async find(jti: string) {
        const key = `${this.CACHE_PREFIX}:${jti}`;

        return await Cache.get(key);
    }

    static async delete(jti: string) {
        const tokenKey = `${this.CACHE_PREFIX}:${jti}`;

        const userId = await Cache.get(tokenKey);

        if (userId) {
            const userKey = `user_tokens:${userId}`;

            await Cache.removeFromSet(userKey, jti);
        }

        await Cache.del(tokenKey);
    }

    static async exists(jti: string) {
        const key = `${this.CACHE_PREFIX}:${jti}`;

        const value = await Cache.get(key);
        return value !== null;
    }

    static async deleteAllFromUser(userId: string) {
        const userKey = `user_tokens:${userId}`;

        const jtIs = await Cache.getMembers(userKey);

        if (!jtIs || jtIs.length === 0) return;

        const keys = jtIs.map(jti => `${this.CACHE_PREFIX}:${jti}`);
        await Cache.del(keys);

        await Cache.del(userKey);
    }

}