import { redis } from "../../../lib/redis.js";
import type { ChatMessagePayload, MatchFoundPayload, SessionEndedPayload } from "../events/chat.types.js";

export class ChatPublisher {
    static async notifyMatchFound(player1Id: string,player2Id: string,sessionId: string) {
        const payload: MatchFoundPayload = {
            type: "MATCH_FOUND",
            players: [player1Id, player2Id],
            sessionId
        };
        await redis.publish("chatsession", JSON.stringify(payload));
    }
    
    static async notifySessionEnded(player1Id: string,player2Id: string,sessionId: string) {
        const payload: SessionEndedPayload = {
            type: "SESSION_ENDED",
            players: [player1Id, player2Id],
            sessionId
        };
        await redis.publish("chatsession", JSON.stringify(payload));
    }

    static async notifyNewMessage(sessionId: string,to: string,content: string) {
        const payload: ChatMessagePayload = {
            type: "NEW_MESSAGE",
            sessionId,
            to,
            content,
            timestamp: Date.now()
        };

        await redis.publish("chatmessage", JSON.stringify(payload));
    }
    
}