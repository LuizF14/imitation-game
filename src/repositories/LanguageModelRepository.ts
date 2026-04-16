import type { LanguageModel } from "../entities/LanguageModel.js";
import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";
import { LanguageModelMapper } from "./mappers/LanguageModelMapper.js";

export class LanguageModelRepository {
    private static CACHE_PREFIX = "languagemodel";

    static async create(aimodel : LanguageModel) {
        return await prisma.aIModel.create(LanguageModelMapper.toDatabase(aimodel));
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return LanguageModelMapper.toDomain(cached);
        }

        const prismaModel = await prisma.aIModel.findUnique({
            where: { id }
        });

        if (!prismaModel) {
            throw new Error("AIProvider not found");
        }

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, LanguageModelMapper.toCache(prismaModel));
        return LanguageModelMapper.toDomain(prismaModel);
    }

    static async update(aimodel: LanguageModel, id : string) {
        await prisma.aIModel.update({
            where: { id },
            data: LanguageModelMapper.toDatabase(aimodel)
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }

    static async delete(id : string) {
        await prisma.aIModel.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }
}