import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";

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
        await prisma.genContentCategory.update({
            where: { id },
            data: data
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }

    static async delete(id : string) {
        await prisma.genContentCategory.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }
}