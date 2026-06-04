import { HumanOrAIEnum } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export class PlayerRepository {
    static async persist(id : string, type: HumanOrAIEnum, tx?: TransactionClient) {
        const data = type === HumanOrAIEnum.HUMAN ? {
            id: id,
            type: type,
            user: {connect: {id : id}}
        } : {
            id: id,
            type: type,
            ai: {connect: {id: id}}
        }

        const client = tx ?? prisma;

        const player = await client.player.upsert({
            where: { id: id },
            update: {},
            create: data
        });
        return player.id;
    }
}