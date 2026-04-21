import { connect } from "node:http2";
import { HumanOrAIEnum } from "../../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { Cache } from "./cache/Cache.js";

export class PlayerRepository {
    private static CACHE_PREFIX = "player";

    static async create(originId : string, type: HumanOrAIEnum) {
        const id = crypto.randomUUID();

        const instance = {
            id: id,
            originId: originId,
            type: type
        }

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, instance, 600);
        return id;
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);

        if (!cached) {
            throw new Error("AI instance not found");
        }

        return cached;
    }

    static async endInstance(id : string) {
        const instance = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        if (!instance) throw new Error("AI instance not found");

        try {
            const data = instance.type === HumanOrAIEnum.HUMAN ? {
                id: id,
                type: instance.type,
                user: {connect: {id : instance.originId}}
            } : {
                id: id,
                type: instance.type,
                ai: {connect: {id: instance.originId}}
            }
            await prisma.player.create({data});
            await Cache.del(`${this.CACHE_PREFIX}:${id}`);
        } catch (err : any) {
            throw new Error(`Failed to persist player log ${id}: ${err.message}`);
        }

    }

}