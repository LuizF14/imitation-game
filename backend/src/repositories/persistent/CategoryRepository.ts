import { prisma } from "../../lib/prisma.js";
import { Cache } from "../Cache.js";

export class CategoryRepository {
    private static CACHE_PREFIX = "imagecategory";

    static async create(name: string, basePrompt: string) {
        return await prisma.genContentCategory.create({
            data: {
                name,
                basePrompt
            }
        });
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return cached;
        }

        const prismaA = await prisma.genContentCategory.findUnique({
            where: { id }
        });

        if (!prismaA) {
            throw new Error(" not found");
        }

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, prismaA);
        return prismaA;
    }

    static async update(data : Partial<{name: string, basePrompt: string}>, id : string) {
        const result = await prisma.genContentCategory.update({
            where: { id },
            data: data
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
        return result;
    }

    static async delete(id : string) {
        const now = new Date();

        const result = await prisma.$transaction(async (tx) => {
            const relatedImages = await tx.image.findMany({
                where: {
                    categoryId: id,
                    deletedAt: null
                },
                select: { id: true }
            });

            await tx.image.updateMany({
                where: { categoryId: id },
                data: { deletedAt: now }
            });

            const result = await tx.genContentCategory.update({
                where: { id },
                data: { deletedAt: now }
            });

            return { result, relatedImages };
        });

        await Promise.all(
            result.relatedImages.map(el => Cache.del(`image:${el.id}`))
        );

        return result.result;
    }

    static async getAll() {
        const results = await prisma.genContentCategory.findMany({
            orderBy: {name: "asc"},
            select: {
                id: true,
                name: true,
                basePrompt: true
            }
        });

        return results;
    }
}