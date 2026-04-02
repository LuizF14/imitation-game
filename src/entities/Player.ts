import type { ChatSession } from "./ChatSession.js";

export abstract class Player {
    public currentSession : ChatSession | null = null;
}