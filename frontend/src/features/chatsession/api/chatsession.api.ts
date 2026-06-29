import { api } from "../../../shared/api/client";
import { WebSocketAPI } from "../../../shared/api/websocketClient";
import type { EndSessionResponse, ServerMessage } from "../types/ChatSession";

type WaitingHandler = () => void;
type MatchFoundHandler = (data: { sessionId?: string }) => void;
type AlreadyInSessionHandler = (data: { sessionId?: string; startedAt?: string }) => void;

export class ChatSessionAPI {
    private ws?: WebSocket;

    private waitingHandler?: WaitingHandler;
    private matchFoundHandler?: MatchFoundHandler;
    private alreadyInSessionHandler?: AlreadyInSessionHandler;

    start(token: string) {
        this.ws = WebSocketAPI.connect("chatsession/start", token);

        this.ws.onmessage = (event) => {
            const msg: ServerMessage = JSON.parse(event.data);
            this.dispatch(msg);
        };
    }

    private dispatch(msg: ServerMessage) {
        switch (msg.type) {
            case "WAITING":
                this.waitingHandler?.();
                break;

            case "MATCH_FOUND":
                this.matchFoundHandler?.({
                    sessionId: msg.sessionId,
                });
                break;

            case "ALREADY_IN_SESSION":
                this.alreadyInSessionHandler?.({
                    sessionId: msg.sessionId,
                    startedAt: msg.startedAt,
                });
                break;
        }
    }

    onWaiting(fn: WaitingHandler) {
        this.waitingHandler = fn;
    }

    onMatchFound(fn: MatchFoundHandler) {
        this.matchFoundHandler = fn;
    }

    onAlreadyInSession(fn: AlreadyInSessionHandler) {
        this.alreadyInSessionHandler = fn;
    }

    sendMessage(content: string) {
        this.ws?.send(
            JSON.stringify({
                type: "CHAT_MESSAGE",
                content,
            })
        );
    }

    disconnect() {
        this.ws?.close();
        this.ws = undefined;

        this.waitingHandler = undefined;
        this.matchFoundHandler = undefined;
        this.alreadyInSessionHandler = undefined;
    }
}