import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { Cache } from "./cache/Cache.js";

export class PlayerJudgmentRepository {
    private static CACHE_PREFIX = "chatsession";
    private static CACHE_SUFIX = "playerjudgment";

    static async addJudgment(turingRate: number, judgeId: string, sessionId: string, judgedId: string) {
        const judgmentKey = `${this.CACHE_PREFIX}:${sessionId}:${this.CACHE_SUFIX}:${judgeId}`;

        const judgment = {
            turingRate,
            judgeId,
            sessionId,
            judgedId
        };

        await Cache.addToList(judgmentKey, judgment);
    }

    static async finalizeJudge(sessionId: string, judgeId: string) {
        const judgmentKey = `${this.CACHE_PREFIX}:${sessionId}:${this.CACHE_SUFIX}:${judgeId}`;

        const judgments = await Cache.getList(judgmentKey);

        if (!judgments || judgments.length === 0) {
            return; 
        }

        const parsedJudgments = judgments.map(raw => {
            const m = typeof raw === "string" ? JSON.parse(raw) : raw;

            return {
                turingRate: m.turingRate,
                judgeId: m.judgeId,
                sessionId: sessionId,
                judgedId: m.judgedId
            };
        });

        await prisma.playerJudgment.createMany({
            data: parsedJudgments
        });

        await Cache.del(judgmentKey);
    }
}