import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { MatchQueueRepository } from "../repositories/volatile/MatchQueueRepository.js";

export class MachmakingService {
    static chooseOpponent() {
        if (process.env.NODE_ENV === 'dev' && process.env.OPPONTENT_TYPE !== 'RANDOM'){
            return process.env.OPPONTENT_TYPE === "HUMAN" ? HumanOrAIEnum.HUMAN : HumanOrAIEnum.AI;
        } else {
            return Math.random() < 0.5 ? HumanOrAIEnum.HUMAN : HumanOrAIEnum.AI;
        }
    }

    static async searchForSession(playerId: string) {
        const {status, opponentId} = await MatchQueueRepository.enqueuePlayer(playerId);
        return {
            status,
            opponentId
        }
    }
}