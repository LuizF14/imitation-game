import { WebSocketsMap } from "../../../domain/WebSocketsMap.js";
import { redis } from "../../../lib/redis.js";
import type { ChatMessagePayload } from "../events/chat.types.js";

export class ChatMessageSubscriber {
    private static subscriber = redis.duplicate();

    static async start() {
        await this.subscriber.subscribe("chatmessage");
        this.listen();
    }

    private static async listen() {
        this.subscriber.on("message", (channel, message) => {
            try {
                const data = JSON.parse(message);
                    
                if (channel === "chatmessage") {
                    switch (data.type) {
                        case "NEW_MESSAGE":
                            this.handleNewMessage(data);
                            break;
                    }
                }
            } catch (err) {
                console.error("Invalid pub/sub message", err);
            }
        });
    }

    private static handleNewMessage(data: ChatMessagePayload) {
        const { to, content, sessionId, timestamp } = data;

        const socket = WebSocketsMap.get(to);

        socket?.send(JSON.stringify({
            type: "NEW_MESSAGE",
            sessionId,
            content,
            timestamp
        }));
    }
}