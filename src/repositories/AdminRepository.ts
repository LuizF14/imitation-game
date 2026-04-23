import { prisma } from "../lib/prisma.js";
import { Cache } from "./cache/Cache.js";

export class AdminRepository {
    private static CACHE_PREFIX = "admin";

    static async create(name : string, email : string, password : string) {
        return await prisma.admin.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        });
    }

    static async findByEmail(email : string) {
        const prismaAdmin = await prisma.user.findUnique({
            where: {email: email}
        });

        return prismaAdmin;
    }

    static async findById(id : string) {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);
        
        if (cached) {
            return cached;
        }

        const prismaAdmin = await prisma.admin.findUnique({
            where: { id }
        });

        if (prismaAdmin) {
            await Cache.set(`${this.CACHE_PREFIX}:${id}`, prismaAdmin);
        }

        return prismaAdmin;
    }

    static async update(data : Partial<{name: string, password: string}>, id : string) {
        await prisma.admin.update({
            where: { id },
            data: data
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }

    static async delete(id : string) {
        await prisma.admin.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        await Cache.del(`${this.CACHE_PREFIX}:${id}`);
    }
}