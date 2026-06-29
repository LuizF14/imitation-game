import { redis } from "../../../lib/redis.js";
import { ChatSessionRepository } from "../../../repositories/persistent/ChatSessionRepository.js";
import { ChatPublisher } from "../publisher/ChatPublisher.js";

export class SessionTimeoutSubscriber {
    private static subscriber = redis.duplicate();

    static async start() {
        await this.subscriber.subscribe("__keyevent@0__:expired");
        await this.listen();
    }

    static async listen() {
        this.subscriber.on("message", async (channel, key) => {
            if (!key.startsWith("session:timeout:")) return;

            const sessionId = key.split(":")[2];
            if (!sessionId) return;

            try {
                const session = await ChatSessionRepository.findById(sessionId);
                if (!session) return;

                await ChatSessionRepository.persistSession(sessionId);

                await ChatPublisher.notifySessionEnded(
                    session.player1Id,
                    session.player2Id,
                    sessionId
                );

            } catch (err) {
                console.error("Error handling session timeout", err);
            }
        });
    }
}

export const sessionTimeoutSubscriber = new SessionTimeoutSubscriber();
