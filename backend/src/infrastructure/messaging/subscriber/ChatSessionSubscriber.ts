import { WebSocketsMap } from "../../../domain/WebSocketsMap.js";
import { redis } from "../../../lib/redis.js";
import type { MatchFoundPayload, SessionEndedPayload } from "../events/chat.types.js";

export class ChatSessionSubscriber {
    private static subscriber = redis.duplicate();

    static async start() {
        await this.subscriber.subscribe("chatsession");
        this.listen();
    }

    private static async listen() {
        this.subscriber.on("message", (channel, message) => {
            try {
                const data = JSON.parse(message);

                if (channel === "chatsession") {
                    switch (data.type) {
                        case "MATCH_FOUND":
                            this.handleMatchFound(data);
                            break;
                        case "SESSION_ENDED":
                            this.handleSessionEnded(data);
                            break;
                    }
                }
            } catch (err) {
                console.error("Invalid pub/sub message", err);
            }
        });
    }

    private static handleMatchFound(data: MatchFoundPayload) {
        const { players, sessionId } = data;
        for (const playerId of players) {
            const socket = WebSocketsMap.get(playerId);

            socket?.send(JSON.stringify({
                type: "MATCH_FOUND",
                sessionId
            }));
        }
    }

    private static async handleSessionEnded(data: SessionEndedPayload) {
        const { players, sessionId } = data;

        for (const playerId of players) {
            const socket = WebSocketsMap.get(playerId);

            if (!socket) continue;

            socket.send(JSON.stringify({
                type: "SESSION_ENDED",
                sessionId
            }));
        }
    }
}