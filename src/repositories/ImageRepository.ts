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
                category: {
                    connect: {id: categoryId}
                },
                fromAdmin: {
                    connect: {id: adminId}
                }
            }
        });
    }

    static async createFromAI(imageURL : string, categoryId : string, modelId : string) {
        return await prisma.image.create({
            data: {
                imageURL: imageURL,
                isAI: HumanOrAIEnum.AI,
                category: {
                    connect: {id: categoryId}
                },
                fromModel: {
                    connect: {id: modelId}
                }
            }
        });
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return cached;
        }

        const prismaImage = await prisma.image.findFirst({
            where: { id },
            select: {
                id: true,
                imageURL: true,
                score: true,
                isAI: true,
                categoryId: true,
                category: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (prismaImage) {
            await Cache.set(`${this.CACHE_PREFIX}:${id}`, prismaImage);
        }

        return prismaImage;
    }

    static async delete(imageId : string, fromId: string) {
        const image = await prisma.image.update({
            where: { id: imageId, OR: [{fromAdminId: fromId}, {fromModelId: fromId}] },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${imageId}`);
        return image;
    }
}