import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";
import { AIModelType } from "../../generated/prisma/client.js";

export class AIModelRepository {
    private static CACHE_PREFIX = "aimodel";

    static async create(name : string, providerId: string, pathURL: string, type: AIModelType) {
        return await prisma.aIModel.create({
            data: {
                name: name,
                providerId: providerId,
                type: type,
                pathURL: pathURL
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
        await prisma.aIModel.update({
            where: { id },
            data: data
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