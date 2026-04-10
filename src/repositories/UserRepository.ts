import type { User } from "../entities/User.js";
import { prisma } from "../prisma.js";

export class UserRepository {
    static async create(user : User) {
        return prisma.user.create({
            data: {
                username: user.username.value,
                email: user.email.value,
                password: user.password.value,
                score: user.score.value,
            }
        });
    }

    static async findByUsername(username : string) : User {
        const User = prisma.user.findFirst({
            where: { username: username }
        });
    }
}