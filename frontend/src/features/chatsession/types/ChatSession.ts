export type ServerMessageType =
    | "WAITING"
    | "MATCH_FOUND"
    | "ALREADY_IN_SESSION"
    | "CHAT_MESSAGE"
    | "SESSION_ENDED";

export interface ServerMessage {
    type: ServerMessageType;
    sessionId?: string;
    startedAt?: string;
    content?: string;
    senderId?: string;
}

export interface EndSessionResponse {
    message: string;
    sessionScore: number;
    opponentType: "HUMAN" | "AI";
}