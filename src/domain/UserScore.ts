import { HumanOrAIEnum } from "../../generated/prisma/enums.js";

export class UserScore {
    static calcultateImageRoundScore = (userAnswer: HumanOrAIEnum, truth: HumanOrAIEnum) => {
        if (userAnswer === truth) return 1;
        else return 0;
    }

    static calculateChatSessionScore = (turingScore: number, truth: HumanOrAIEnum) => {
        const confidence = truth == HumanOrAIEnum.HUMAN ? turingScore : (1 - turingScore);
        return confidence * 100;
    }
}