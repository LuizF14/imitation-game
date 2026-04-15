import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { Admin } from "./Admin.js";
import type { GenContentCategory } from "./GenContentCategory.js";
import type { ImageGenerationModel } from "./ImageGenerationModel.js";
import { Score } from "./value_object/Score.js";

export class Image {
    public imageURL : string;
    public score : Score;
    public from : ImageGenerationModel | Admin;
    public category : GenContentCategory;

    constructor(imageURL : string, category : GenContentCategory, from : ImageGenerationModel | Admin, score? : number) {
        this.imageURL = imageURL;
        this.from = from;
        this.category = category;
        this.score = new Score(score) ?? new Score();
    }

    get isAI() : HumanOrAIEnum {
        return this.from instanceof Admin ? HumanOrAIEnum.HUMAN : HumanOrAIEnum.AI;
    }
}