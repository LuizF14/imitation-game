import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { Cache } from "./cache/Cache.js";
import { MessageRepository } from "./MessageRepository.js";
import { PlayerJudgmentRepository } from "./PlayerJudgmentRepository.js";
import { PlayerRepository } from "./PlayerRepository.js";

export class ChatSessionRepository {
    private static CACHE_PREFIX = "chatsession";

    static async create(player1Id : string, player2Id : string) {
        const session = {
            id: crypto.randomUUID(),
            startedAt: new Date().toISOString(),
            player1Id: player1Id,
            player2Id: player2Id
        };
        const sessionKey = `${this.CACHE_PREFIX}:${session.id}`;
        await Cache.set(sessionKey, session, 600);
        return session.id;
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);

        if (!cached) {
            throw new Error("Chat session not found");
        }

        return cached;
    }

    static async endSession(sessionId: string) {
        const sessionKey = `${this.CACHE_PREFIX}:${sessionId}`;
        const session = await Cache.get(sessionKey);

        if (!session) throw new Error("Session not found");

        try {
            await PlayerRepository.endInstance(session.player1Id);
            await PlayerRepository.endInstance(session.player2Id);
            await prisma.chatSession.create({
                data: {
                    id: session.id,
                    startedAt: new Date(session.startedAt),
                    endedAt: new Date(),
                    player1Id: session.player1Id,
                    player2Id: session.player2Id
                }
            });
            await MessageRepository.endSession(session.id);
            await PlayerJudgmentRepository.finalizeJudge(session.id, session.player1Id);
            await PlayerJudgmentRepository.finalizeJudge(session.id, session.player2Id);

            await Cache.del(sessionKey);
            
        } catch (err : any) {
            throw new Error(`Failed to persist session ${sessionId}: ${err.message}`);
        }

    }
}