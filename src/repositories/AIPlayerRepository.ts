import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";

export class AIPlayerRepository {
    private static CACHE_PREFIX = "aiplayer";

    static async create(modelId : string) {
        const id = crypto.randomUUID();

        const player = {
            modelId: modelId
        };

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, player, 600);
        return id;
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);

        if (!cached) {
            throw new Error("AI player not found");
        }

        return cached;
    }

    static async endPlayer(id : string) {
        const player = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        if (!player) throw new Error("Player not found");

        try {
            await prisma.aIPlayer.create({
                data: {
                    id: id,
                    modelId: player.modelId
                }
            });
            await Cache.del(`${this.CACHE_PREFIX}:${id}`);
        } catch (err : any) {
            throw new Error(`Failed to log AIPlayer ${id}: ${err.message}`);
        }
    }

}