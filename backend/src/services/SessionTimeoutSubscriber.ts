import { redis } from "../lib/redis.js";
import { ChatSessionRepository } from "../repositories/persistent/ChatSessionRepository.js";
import { matchmakingEventBus } from "./SocketMapStore.js";

export class SessionTimeoutSubscriber {
    private sub = redis.duplicate();

    async init() {
        // escuta eventos de expiração
        await this.sub.subscribe("__keyevent@0__:expired");

        this.sub.on("message", async (_, key) => {
            if (!key.startsWith("session:timeout:")) return;

            const sessionId = key.split(":")[2];
            if (!sessionId) return;

            try {
                const session = await ChatSessionRepository.findById(sessionId);
                if (!session) return;

                await ChatSessionRepository.persistSession(sessionId);

                await matchmakingEventBus.notifySessionEnded(
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
