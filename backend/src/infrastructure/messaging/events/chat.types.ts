export type MatchFoundPayload = {
    type: "MATCH_FOUND";
    players: [string, string];
    sessionId: string;
};

export type SessionEndedPayload = {
    type: "SESSION_ENDED";
    players: [string, string];
    sessionId: string;
};

export type ChatMessagePayload = {
    type: "NEW_MESSAGE";
    sessionId: string;
    to: string;
    content: string;
    timestamp: number;
};
