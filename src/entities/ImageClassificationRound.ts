import type { User } from "./User.js";
import { Image } from "./Image.js";
import { HumanOrAIEnum } from "./enums/HumanOrAIEnum.js";

export class ImageClassificationRound {
    public userAnswer : HumanOrAIEnum | undefined;
    public timeToAnswerMs : number | undefined;
    public classifierUser : User;
    public image : Image;

    constructor(image : Image, user : User) {
        this.image = image;
        this.classifierUser = user;
    }

    private static readonly K = 20000;

    calculatePlayerScore(): number {
        if (this.userAnswer === undefined || this.timeToAnswerMs == undefined) throw new Error("User has not given an answer yet");

        const userIsRight = this.userAnswer == this.image.isAI;
        const time_multiplier = Math.max(0.2, 1 - Math.tanh(this.timeToAnswerMs / ImageClassificationRound.K));
        return userIsRight ? 100 * time_multiplier : 0;
    }

    calculateAIScore(): number {
        if (this.userAnswer === undefined || this.timeToAnswerMs == undefined) throw new Error("User has not given an answer yet");
        
        const imageIsAI = this.image.isAI === HumanOrAIEnum.AI;
        const userWasDeceived = imageIsAI && this.userAnswer === HumanOrAIEnum.HUMAN;

        if (!userWasDeceived) return 0;

        const time_multiplier = Math.max(0.2, 1 - Math.tanh(this.timeToAnswerMs / ImageClassificationRound.K));
        return 100 * time_multiplier;
    }
}