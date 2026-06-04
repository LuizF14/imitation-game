import { HumanOrAIEnum } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { Cache } from "../Cache.js";
import type { Image } from "../../../generated/prisma/client.js";

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

    static async updateScore(score: number, imageId: string){
        const image = await prisma.image.update({
            where: { id: imageId },
            data: {
                score: {
                    increment: score
                }
            }
        });
        
        await Cache.del(`${this.CACHE_PREFIX}:${imageId}`);
        return image;
    }

    static async findRandom() {
        const [randomItem] = await prisma.$queryRaw<(Image & { categoryName: string })[]>`
            SELECT 
                i.*, 
                c.name AS "categoryName"
            FROM "Image" i
            JOIN "GenContentCategory" c ON i."categoryId" = c.id
            WHERE i."deletedAt" IS NULL
            ORDER BY RANDOM() 
            LIMIT 1
        `;
        return randomItem;
    }
}