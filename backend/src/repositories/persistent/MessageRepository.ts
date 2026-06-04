import { prisma } from "../../lib/prisma.js";
import { Cache } from "../Cache.js";

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

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

    static async persist(sessionId: string, tx?: TransactionClient) {
        const key = `${this.CACHE_PREFIX}:${sessionId}:${this.CACHE_SUFIX}`;
        const messages = await Cache.getList(key);

        if (!messages || messages.length === 0) return; 

        const parsedMessages = messages.map(raw => {
            const m = typeof raw === "string" ? JSON.parse(raw) : raw;

            return {
                content: m.content,
                creationDurationMs: m.creationDurationMs,
                sessionId: sessionId,
                playerId: m.fromId
            };
        });

        const client = tx ?? prisma;

        await client.message.createMany({ data: parsedMessages });
        await Cache.del(key);
    }
}