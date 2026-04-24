import type { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { Cache } from "./cache/Cache.js";

export class ImageClassificationRoundRepository {
    private static CACHE_PREFIX = "imageclsround";

    static async create(imageId : string, categoryName: string, imageURL: string, isAI: HumanOrAIEnum, userId : string, modelId : string | null) {
        const session = {
            imageId,
            categoryName, 
            imageURL,
            userId,
            modelId,
            isAI,
            startedAt: new Date().toISOString(),
        }
        const sessionKey = `${this.CACHE_PREFIX}:${session.userId}`;

        await Cache.set(sessionKey, session, 600);
        return session;
    }

    static async findCurrentUserSession(userId: string) {
        const sessionKey = `${this.CACHE_PREFIX}:${userId}`;
        const session = await Cache.get(sessionKey);
        return session;
    }

    static async endSession(userId : string, userAnswer : HumanOrAIEnum) {
        const sessionKey = `${this.CACHE_PREFIX}:${userId}`;
        const session = await Cache.get(sessionKey);

        if (!session) throw new Error("Session not found");

        try {
            const timeToAnswerMs = new Date().getTime() - new Date(session.startedAt).getTime();
            await prisma.imageClassificationRound.create({
                data: {
                    userAnswer: userAnswer,
                    imageId: session.imageId,
                    userId: session.userId,
                    timeToAnswerMs: timeToAnswerMs
                }
            });

            await Cache.del(sessionKey);
        } catch (err : any) {
            throw new Error(`Failed to persist session of ${userId}: ${err.message}`);
        }
    }
}