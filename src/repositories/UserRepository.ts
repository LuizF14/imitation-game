import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";

export class UserRepository {
    private static CACHE_PREFIX = "user";

    static async create(username : string, email : string, password : string) {
        return await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: password
            }
        });
    }

    static async findByEmail(email : string) {
        const prismaUser = await prisma.user.findUnique({
            where: {email: email}
        });

        if (!prismaUser) throw new Error("User not found");

        return prismaUser;
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);

        if (cached) {
            return cached;
        }

        const prismaUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!prismaUser) {
            throw new Error("User not found");
        }

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, prismaUser);
        return prismaUser;
    }

    static async update(data : Partial<{username: string, password: string, score: number}>, id: string) {
        await prisma.user.update({
            where: { id },
            data: data
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }

    static async delete(id : string) {
        await prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }
}