import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { Admin } from "./Admin.js";
import type { GenContentCategory } from "./GenContentCategory.js";
import type { ImageGenerationModel } from "./ImageGenerationModel.js";
import { Score } from "./value_object/Score.js";

export class Image {
    public imageURL : string;
    public score : Score = new Score();
    public from : ImageGenerationModel | Admin;
    public category : GenContentCategory;

    constructor(imageURL : string, category : GenContentCategory, from : ImageGenerationModel | Admin) {
        this.imageURL = imageURL;
        this.from = from;
        this.category = category;
    }

    get isAI() : HumanOrAIEnum {
        return this.from instanceof Admin ? HumanOrAIEnum.HUMAN : HumanOrAIEnum.AI;
    }
}