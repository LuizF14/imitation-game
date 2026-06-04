import { prisma } from "../../lib/prisma.js";
import { Cache } from "../Cache.js";
import type { AIModelType, AIModel } from "../../../generated/prisma/client.js";

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

    static async findByApiKey(apiKey: string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${apiKey}`);
        
        if (cached) {
            return cached;
        }
        
        const prismaModel = await prisma.aIModel.findFirst({
            where: { apiKey: apiKey },
            select: {
                id: true,
                pathURL: true,
                provider: {
                    select: {
                        baseURL: true
                    }
                }
            }
        });

        if (prismaModel) {
            await Cache.set(`${this.CACHE_PREFIX}:${apiKey}`, prismaModel);
        }

        return prismaModel;
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return cached;
        }

        const prismaModel = await prisma.aIModel.findFirst({
            where: { id },
            include: {
                provider: true
            }
        });

        if (prismaModel) {
            await Cache.set(`${this.CACHE_PREFIX}:${id}`, prismaModel);
        }

        return prismaModel;
    }

    static async update(data : Partial<{pathURL: string}>, modelId : string, providerId : string) {
        const model = await prisma.aIModel.update({
            where: { id: modelId, providerId: providerId },
            data: data
        });

        await Cache.del(`${this.CACHE_PREFIX}:${modelId}`);
        return model;
    }

    static async updateScore(score: number, modelId : string) {
        const model = await prisma.aIModel.update({
            where: { id: modelId },
            data: {
                score: {
                    increment: score
                }
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${modelId}`);
        return model;
    }

    static async delete(modelId : string, providerId : string) {
        const model = await prisma.aIModel.update({
            where: { id: modelId, providerId: providerId },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${modelId}`);
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


    static async getLeaderboard() {
        const cacheKey = `${this.CACHE_PREFIX}:leaderboard`;
        const cached = await Cache.get(cacheKey);
        if (cached) return cached;

        const results = await prisma.aIModel.findMany({
            orderBy: {
                score: "desc"
            },
            take: 50,
            select: {
                id: true,
                name: true,
                score: true,
                pathURL: true
            }
        });

        if (results) await Cache.set(cacheKey, results);
        return results;
    }

    static async findRandom() {
        const [randomItem] = await prisma.$queryRaw<(AIModel & { providerName: string, baseURL: string })[]>`
            SELECT 
                m.*, 
                p.name AS "providerName",
                p."baseURL" AS "baseURL" -- 💡 Adicionadas aspas duplas em p."baseURL"
            FROM "AIModel" m
            JOIN "AIProvider" p ON m."providerId" = p.id
            WHERE m."deletedAt" IS NULL
            ORDER BY RANDOM() 
            LIMIT 1
        `;
        return randomItem;
    }
}