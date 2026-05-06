import { redis } from "../lib/redis.js";
import { WebSocketsMap } from "../domain/WebSocketsMap.js";

type MatchFoundPayload = {
    type: "MATCH_FOUND";
    players: [string, string];
    sessionId: string;
};

type SessionEndedPayload = {
    type: "SESSION_ENDED";
    players: [string, string];
    sessionId: string;
};

type ChatMessagePayload = {
    type: "NEW_MESSAGE";
    sessionId: string;
    to: string;
    content: string;
    timestamp: number;
};



class MatchmakingEventBus {
    private subscriber = redis.duplicate();

    async init() {
        await this.subscriber.subscribe("chatsession");
        await this.subscriber.subscribe("chatmessage");
        await this.listenToMatch();
    }

    async notifyMatchFound(
        player1Id: string,
        player2Id: string,
        sessionId: string
    ) {
        const payload: MatchFoundPayload = {
            type: "MATCH_FOUND",
            players: [player1Id, player2Id],
            sessionId
        };
        await redis.publish("chatsession", JSON.stringify(payload));
    }

    async notifySessionEnded(
        player1Id: string,
        player2Id: string,
        sessionId: string
    ) {
        const payload: SessionEndedPayload = {
            type: "SESSION_ENDED",
            players: [player1Id, player2Id],
            sessionId
        };
        await redis.publish("chatsession", JSON.stringify(payload));
    }

    async notifyNewMessage(
        sessionId: string,
        to: string,
        content: string
    ) {
        const payload: ChatMessagePayload = {
            type: "NEW_MESSAGE",
            sessionId,
            to,
            content,
            timestamp: Date.now()
        };

        await redis.publish("chatmessage", JSON.stringify(payload));
    }


    listenToMatch() {
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


    handleMatchFound(data: MatchFoundPayload) {
        const { players, sessionId } = data;
        for (const playerId of players) {
            const socket = WebSocketsMap.get(playerId);

            socket?.send(JSON.stringify({
                type: "MATCH_FOUND",
                sessionId
            }));
        }
    }

    handleSessionEnded(data: SessionEndedPayload) {
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

    handleNewMessage(data: ChatMessagePayload) {
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

export const matchmakingEventBus = new MatchmakingEventBus();
 
