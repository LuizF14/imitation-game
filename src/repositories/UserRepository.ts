import { User } from "../entities/User.js";
import { Password } from "../entities/value_object/Password.js";
import { prisma } from "../prisma.js";

export class UserRepository {
    static async create(user : User) {
        return await prisma.user.create({
            data: {
                username: user.username.value,
                email: user.email.value,
                password: user.password.hash,
                score: user.score.value,
            }
        });
    }

    static async findByUsername(username : string) : Promise<User> {
        const user = await prisma.user.findFirst({
            where: { username: username }
        });

        if (user == undefined) 
            throw new Error("User could not be found");

        return new User(
            user.username, 
            user.email, 
            Password.createFromHash(user.password),
            user.score
        );
    }
}