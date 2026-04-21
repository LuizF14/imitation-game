import { prisma } from "../lib/prisma.js";
import { Cache } from "./cache/Cache.js";
import { AIModelType } from "../../generated/prisma/client.js";

export class AIModelRepository {
    private static CACHE_PREFIX = "aimodel";

    static async create(name : string, providerId: string, apiKey: string, pathURL: string, type: AIModelType) {
        return await prisma.aIModel.create({
            data: {
                name: name,
                providerId: providerId,
                type: type,
                pathURL: pathURL,
                apiKey: apiKey
            }
        });
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return cached;
        }

        const prismaModel = await prisma.aIModel.findUnique({
            where: { id }
        });

        if (!prismaModel) {
            throw new Error("AIModel not found");
        }

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, prismaModel);
        return prismaModel;
    }

    static async update(data : Partial<{pathURL: string, score: number}>, id : string) {
        const model = await prisma.aIModel.update({
            where: { id },
            data: data
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
        return model;
    }

    static async delete(id : string) {
        const model = await prisma.aIModel.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
        return model;
    }

    static async search(query: string) {
        const results = await prisma.$queryRaw`
        SELECT
            id,
            name
        FROM "AIModel"
        WHERE
            name % ${query} 
        ORDER BY
            GREATEST(
            similarity(name, ${query})
            ) DESC
        LIMIT 20
        `;

        return results;
    }


    static async getLeaderboard(top: number) {
        const cacheKey = `${this.CACHE_PREFIX}:leaderboard`;
        const cached = await Cache.get(cacheKey);
        if (cached) return cached;

        const results = await prisma.aIModel.findMany({
            orderBy: {
                score: "desc"
            },
            take: top,
            select: {
                id: true,
                name: true,
                score: true
            }
        });

        if (results) await Cache.set(cacheKey, results);
        return results;
    }
}