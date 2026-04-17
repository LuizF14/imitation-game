import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";
import { MessageRepository } from "./MessageRepository.js";
import { PlayerJudgmentRepository } from "./PlayerJudgmentRepository.js";

export class ChatSessionRepository {
    private static CACHE_PREFIX = "chatsession";

    static async create(player1Id : string, player2Id : string, player2Type: HumanOrAIEnum) {
        const session = {
            id: crypto.randomUUID(),
            startedAt: new Date().toISOString(),
            player1Id,
            player2Id,
            player2Type
        };
        const sessionKey = `${this.CACHE_PREFIX}:${session.id}`;
        await Cache.set(sessionKey, session, 600);
        
        await MessageRepository.createMessageList(session.id);
        await PlayerJudgmentRepository.createJudgmentList(session.id, session.player1Id);
        if (player2Type === HumanOrAIEnum.HUMAN) {
            await PlayerJudgmentRepository.createJudgmentList(session.id, session.player2Id);
        }

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
            const userplayer2_id = session.player2Type === HumanOrAIEnum.HUMAN ? session.player2Id : null;
            const aiplayer_id = session.player2Type === HumanOrAIEnum.AI ? session.player2Id : null;

            await prisma.chatSession.create({
                data: {
                    id: session.id,
                    startedAt: new Date(session.startedAt),
                    endedAt: new Date(),
                    userplayer1_id: session.player1Id,
                    userplayer2_id: userplayer2_id ?? null,
                    aiplayer_id: aiplayer_id ?? null
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