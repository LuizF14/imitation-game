import { buildApp } from "./app.js";
import { redis } from "./lib/redis.js";
import { AdminRepository } from "./repositories/persistent/AdminRepository.js";
import { Password } from "./domain/Password.js";
import { ChatMessageSubscriber } from "./infrastructure/messaging/subscriber/ChatMessageSubscriber.js";
import { ChatSessionSubscriber } from "./infrastructure/messaging/subscriber/ChatSessionSubscriber.js";
import { SessionTimeoutSubscriber } from "./infrastructure/messaging/subscriber/SessionTimeoutSubscriber.js";

const app = await buildApp();

export const start = async () => {
    try {
        await app.listen({port: 3000});
        console.log("Server is running on https://localhost:3000");
    } catch (err : any) {
        app.log.error(err);
        process.exit(1);
    }
}

// await AdminRepository.create("luiz", "luiz@gmail.com", (await Password.createFromPlainText("hello123")).hash);

await redis.config("SET", "notify-keyspace-events", "Ex");
await ChatMessageSubscriber.start();
await ChatSessionSubscriber.start();
await SessionTimeoutSubscriber.start();

start();