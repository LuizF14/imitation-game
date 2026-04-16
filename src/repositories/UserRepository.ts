import { User } from "../entities/User.js";
import { prisma } from "../prisma.js";
import { Cache } from "./cache/Cache.js";
import { UserMapper } from "./mappers/UserMapper.js";

export class UserRepository {
    private static CACHE_PREFIX = "user";

    static async create(user : User) {
        return await prisma.user.create(UserMapper.toDatabase(user));
    }

    static async findByEmail(email : string) : Promise<User> {
        const prismaUser = await prisma.user.findUnique({
            where: {email: email}
        });

        if (!prismaUser) throw new Error("User not found");

        return UserMapper.toDomain(prismaUser);
    }

    static async findById(id : string) : Promise<User> {
        const cached = await Cache.get(`${this.CACHE_PREFIX}:${id}`);

        if (cached) {
            return UserMapper.toDomain(cached);
        }

        const prismaUser = await prisma.user.findUnique({
            where: { id }
        });

        if (!prismaUser) {
            throw new Error("User not found");
        }

        await Cache.set(`${this.CACHE_PREFIX}:${id}`, UserMapper.toCache(prismaUser));
        return UserMapper.toDomain(prismaUser);
    }

    static async update(user: User, id: string): Promise<void> {
        await prisma.user.update({
            where: { id },
            data: UserMapper.toDatabase(user)
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