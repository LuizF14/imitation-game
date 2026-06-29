import type { ImageDTO } from "../domain/schemas/image.schema.js";
import { ValidationError } from "../errors/errors.js";
import { ImageRepository } from "../repositories/persistent/ImageRepository.js";

export class ImageService {
    static async add(data: ImageDTO, id: string) {
        const image = await ImageRepository.createFromAdmin(
            data.imageURL, 
            data.categoryId,
            id
        );

        return {image};
    }

    static async get(id: string) {
        const image = await ImageRepository.findById(id);
        if(!image) throw new ValidationError("Image not found");
        return {image};
    }

    static async delete(imageId: string, ownerId: string) {
        const image = await ImageRepository.delete(imageId, ownerId);
        if (!image) throw new ValidationError("Image not found");
    }
}