import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { Cache } from "./cache/Cache.js";

export class ImageRepository {
    private static CACHE_PREFIX = "image";

    static async createFromAdmin(imageURL : string, categoryId : string, adminId : string) {
        return await prisma.image.create({
            data: {
                imageURL: imageURL,
                isAI: HumanOrAIEnum.HUMAN,
                categoryId: categoryId,
                fromAdminId: adminId
            }
        });
    }

    static async createFromAI(imageURL : string, categoryId : string, modelId : string) {
        return await prisma.image.create({
            data: {
                imageURL: imageURL,
                isAI: HumanOrAIEnum.AI,
                categoryId: categoryId,
                fromModelId: modelId
            }
        });
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return cached;
        }

        const prismaImage = await prisma.image.findUnique({
            where: { id }
        });

        if (!prismaImage) {
            throw new Error("Image not found");
        }

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, prismaImage);
        return prismaImage;
    }

    static async update(data : Partial<{imageURL: string, score: number}>, id : string) {
        await prisma.image.update({
            where: { id },
            data: data
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }

    static async delete(id : string) {
        await prisma.image.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }
}