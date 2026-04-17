import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";

export class PlayerJudgmentRepository {
    private static CACHE_PREFIX = "chatsession";
    private static CACHE_SUFIX = "playerjudgment";

    static async createJudgmentList(sessionId : string, judgeId : string) {
        const judgmentKey = `${this.CACHE_PREFIX}:${sessionId}:${this.CACHE_SUFIX}:${judgeId}`;
        await Cache.set(judgmentKey, [], 600);
    }

    static async addJudgment(turingRate: number, judgeId: string, sessionId: string, judgedId: string, type: HumanOrAIEnum) {
        const judgmentKey = `${this.CACHE_PREFIX}:${sessionId}:${this.CACHE_SUFIX}:${judgeId}`;

        const judgment = {
            turingRate,
            judgeId,
            sessionId,
            judgedId,
            type
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
            const judged_user_id = m.type === HumanOrAIEnum.HUMAN ? m.judgedId : null;
            const judged_ai_id = m.type === HumanOrAIEnum.AI ? m.judgedId : null;

            return {
                turingRate: m.turingRate,
                judgeId: m.judgeId,
                sessionId: sessionId,
                judged_user_id: judged_user_id,
                judged_ai_id: judged_ai_id
            };
        });

        await prisma.playerJudgment.createMany({
            data: parsedJudgments
        });

        await Cache.del(judgmentKey);
    }
}