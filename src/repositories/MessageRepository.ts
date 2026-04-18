import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";

export class MessageRepository {
    private static CACHE_PREFIX = "chatsession";
    private static CACHE_SUFIX = "messages";

    static async addMessage(sessionId: string, content: string, from: string, creationDurationMs: number) {
        const key = `${this.CACHE_PREFIX}:${sessionId}:${this.CACHE_SUFIX}`;
        await Cache.addToList(key, {
            content: content,
            creationDurationMs: creationDurationMs,
            fromId: from
        });
    }

    static async getAll(sessionId : string) {
        const key = `${this.CACHE_PREFIX}:${sessionId}:${this.CACHE_SUFIX}`;
        return await Cache.getList(key);
    }

    static async endSession(sessionId: string) {
        const key = `${this.CACHE_PREFIX}:${sessionId}:${this.CACHE_SUFIX}`;

        const messages = await Cache.getList(key);

        if (!messages || messages.length === 0) {
            return; 
        }

        const parsedMessages = messages.map(raw => {
            const m = typeof raw === "string" ? JSON.parse(raw) : raw;

            return {
                content: m.content,
                creationDurationMs: m.creationDurationMs,
                sessionId: sessionId,
                playerId: m.fromId
            };
        });

        await prisma.message.createMany({
            data: parsedMessages
        });

        await Cache.del(key);
    }
}