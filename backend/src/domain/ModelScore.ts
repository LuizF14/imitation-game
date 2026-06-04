import { HumanOrAIEnum } from "../../generated/prisma/enums.js";

export class ModelScore {
    static calcultateImageRoundScore = (userAnswer: HumanOrAIEnum, truth: HumanOrAIEnum) => {
        if (userAnswer === HumanOrAIEnum.HUMAN && truth === HumanOrAIEnum.AI) return 1;
        if (userAnswer === HumanOrAIEnum.AI && truth === HumanOrAIEnum.AI) return 0;
        else return 0;
    }
}