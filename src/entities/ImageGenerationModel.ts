import { AIModel } from "./AIModel.js";
import { Image } from "./Image.js";

export class ImageGenerationModel extends AIModel {
    public imagesGenerated : Image[] = [];
}