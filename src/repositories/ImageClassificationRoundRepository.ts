import type { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";

export class ImageClassificationRoundRepository {
    private static CACHE_PREFIX = "imageclsround";

    static async create(imageId : string, userId : string) {
        const session = {
            id: crypto.randomUUID(),
            imageId,
            userId,
            startedAt: new Date().toISOString(),
        }
        const sessionKey = `${this.CACHE_PREFIX}:${session.id}`;

        await Cache.set(sessionKey, session, 600);
        return session.id;
    }

    static async endSession(sessionId : string, userAnswer : HumanOrAIEnum, endedAt : Date) {
        const sessionKey = `${this.CACHE_PREFIX}:${sessionId}`;
        const session = await Cache.get(sessionKey);

        if (!session) throw new Error("Session not found");

        try {
            const timeToAnswerMs = endedAt.getTime() - new Date(session.startedAt).getTime();
            await prisma.imageClassificationRound.create({
                data: {
                    id: sessionId,
                    userAnswer: userAnswer,
                    imageId: session.imageId,
                    userId: session.userId,
                    timeToAnswerMs: timeToAnswerMs
                }
            });
        } catch (err : any) {
            throw new Error(`Failed to persist session ${sessionId}: ${err.message}`);
        }
    }
}