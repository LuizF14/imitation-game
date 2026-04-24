import type { HumanOrAIEnum } from "../../generated/prisma/enums.js";

export class UserScore {
    static calcultateImageRoundScore = (userAnswer: HumanOrAIEnum, truth: HumanOrAIEnum) => {
        if (userAnswer === truth) return 1;
        else return 0;
    }
}