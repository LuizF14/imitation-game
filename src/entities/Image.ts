import type { Admin } from "./Admin.js";
import type { GenContentCategory } from "./GenContentCategory.js";
import type { ImageGenerationModel } from "./ImageGenerationModel.js";
import { Score } from "./value_object/Score.js";

export class Image {
    public imageURL : string;
    public score : Score = new Score();
    public isAI : boolean | undefined;
    public from : ImageGenerationModel | Admin;
    public category : GenContentCategory;

    constructor(imageURL : string, category : GenContentCategory, from : ImageGenerationModel | Admin) {
        this.imageURL = imageURL;
        this.from = from;
        this.category = category;
    }
}