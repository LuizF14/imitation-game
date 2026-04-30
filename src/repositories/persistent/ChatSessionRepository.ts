import { HumanOrAIEnum } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { Cache } from "../Cache.js";
import { MessageRepository } from "./MessageRepository.js";
import { PlayerJudgmentRepository } from "./PlayerJudgmentRepository.js";
import { PlayerRepository } from "./PlayerRepository.js";

export class ChatSessionRepository {
    private static CACHE_PREFIX = "chatsession";

    static async create(player1Id : string, player2Id : string, player1Type : HumanOrAIEnum, player2Type : HumanOrAIEnum) {
        const session = {
            id: crypto.randomUUID(),
            startedAt: new Date().toISOString(),
            player1Id: player1Id,
            player2Id: player2Id,
            player1Type: player1Type,
            player2Type: player2Type
        };
        const sessionKey = `${this.CACHE_PREFIX}:${session.id}`;
        await Cache.set(sessionKey, session, 600);

        if (player1Type === HumanOrAIEnum.HUMAN) await Cache.set(`playersession:${player1Id}`, session.id, 600);
        if (player2Type === HumanOrAIEnum.HUMAN) await Cache.set(`playersession:${player2Id}`, session.id, 600);

        await Cache.set(`session:timeout:${session.id}`,"1",600);

        return session;
    }

    static async findActiveByPlayer(playerId: string) {
        const sessionId = await Cache.get(`playersession:${playerId}`);

        if (!sessionId) return null;

        const session = await Cache.get(`${this.CACHE_PREFIX}:${sessionId}`);

        if (!session) {
            await Cache.del(`playersession:${playerId}`);
            return null;
        }

        return session;
    }

    static async findById(id : string) {
        const session = await Cache.get(`${this.CACHE_PREFIX}:${id}`);

        return session;
    }

    static async persistSession(sessionId: string) {
        const sessionKey = `${this.CACHE_PREFIX}:${sessionId}`;
        const session = await Cache.get(sessionKey);

        if (!session) throw new Error("Session not found");

        await prisma.$transaction(async (tx) => {
            const player1Id = await PlayerRepository.persist(session.player1Id, session.player1Type, tx);
            const player2Id = await PlayerRepository.persist(session.player2Id, session.player2Type, tx);
            await tx.chatSession.create({
                data: {
                    id: session.id,
                    startedAt: new Date(session.startedAt),
                    endedAt: new Date(),
                    player1Id: player1Id,
                    player2Id: player2Id
                }
            });
            await MessageRepository.persist(session.id, tx);
            await PlayerJudgmentRepository.persist(session.id, session.player1Id, tx);
            await PlayerJudgmentRepository.persist(session.id, session.player2Id, tx);
        });
        
        await Cache.del(sessionKey);
        await Cache.del(`playersession:${session.player1Id}`);
        await Cache.del(`playersession:${session.player2Id}`);
        await Cache.del(`session:timeout:${session.id}`);
    }
}