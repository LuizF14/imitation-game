import { cleanDatabase, disconnectDB } from "./utils/cleanDB.js";
import { cleanRedis, disconnectCache } from "./utils/cleanCache.js";
import { prisma } from "../src/lib/prisma.js";
import { Password } from "../src/domain/Password.js";

beforeEach(async () => {
  await cleanDatabase();
  await cleanRedis();
});

afterAll(async () => {
  await disconnectCache();
  await disconnectDB();
});


export async function seedAdmin() {
    const hashedPassword = await Password.createFromPlainText("hello123");
    await prisma.admin.create({
        data: {
            name: "AdminSeed",
            email: "adminseed@email.com",
            password: hashedPassword.hash,
        }
    });
}