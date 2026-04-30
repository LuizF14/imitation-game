import { prisma } from "../../lib/prisma.js";
import { Cache } from "../Cache.js";

export class AIProviderRepository {
    private static CACHE_PREFIX = "aiprovider";

    static async create(name : string, baseURL : string, email: string, password: string) {
        return await prisma.aIProvider.create({
            data: {
                name: name,
                baseURL: baseURL,
                email: email,
                password: password
            }
        });
    }

    static async findByEmail(email : string) {
        const prismaProvider = await prisma.aIProvider.findFirst({
            where: {email: email}
        });

        return prismaProvider;
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return cached;
        }

        const prismaProvider = await prisma.aIProvider.findFirst({
            where: { id }
        });

        if (prismaProvider) {
            await Cache.set(`${this.CACHE_PREFIX}:${id}`, prismaProvider);
        }

        return prismaProvider;
    }

    static async update(data : Partial<{name: string, baseURL: string}>, id : string) {
        const provider = await prisma.aIProvider.update({
            where: { id },
            data: data
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
        return provider;
    }

    static async delete(id : string) {
        const now = new Date();

        const result = await prisma.$transaction(async (tx) => {
            const relatedModels = await tx.aIModel.findMany({
                where: {
                    providerId: id,
                    deletedAt: null
                },
                select: { id: true }
            });

            await tx.aIModel.updateMany({
                where: { providerId: id },
                data: { deletedAt: now }
            });

            const provider = await tx.aIProvider.update({
                where: { id },
                data: { deletedAt: now }
            });

            return { provider, relatedModels };
        });

        await Promise.all([
            ...result.relatedModels.map(el => Cache.del(`aimodel:${el.id}`)),
            Cache.del(`aiprovider:${id}`)
        ]);

        return result.provider;
    }
}