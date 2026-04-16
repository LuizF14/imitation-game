import type { AIProvider } from "../entities/AIProvider.js";
import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";
import { AIProviderMapper } from "./mappers/AIProviderMapper.js";

export class AIProviderRepository {
    private static CACHE_PREFIX = "aiprovider";

    static async create(aiprovider : AIProvider) {
        return await prisma.aIProvider.create(AIProviderMapper.toDatabase(aiprovider));
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return AIProviderMapper.toDomain(cached);
        }

        const prismaProvider = await prisma.aIProvider.findUnique({
            where: { id }
        });

        if (!prismaProvider) {
            throw new Error("AIProvider not found");
        }

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, AIProviderMapper.toCache(prismaProvider));
        return AIProviderMapper.toDomain(prismaProvider);
    }

    static async update(provider: AIProvider, id : string) {
        await prisma.aIProvider.update({
            where: { id },
            data: AIProviderMapper.toDatabase(provider)
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }

    static async delete(id : string) {
        await prisma.aIProvider.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }
}