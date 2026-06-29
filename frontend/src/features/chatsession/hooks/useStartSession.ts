import { useEffect, useRef, useState } from "react";
import { ChatSessionAPI } from "../api/chatsession.api";
import type { ServerMessageType } from "../types/ChatSession";

interface UseStartSessionState {
    status: ServerMessageType | null;
    sessionId?: string;
    startedAt?: string;
    isConnecting: boolean;
    isError: boolean;
}

export function useStartSession() {
    const token = localStorage.getItem("access_token");

    const chatRef = useRef<ChatSessionAPI | null>(null);

    const [state, setState] = useState<UseStartSessionState>({
        status: null,
        isConnecting: true,
        isError: false,
    });

    useEffect(() => {
        if (!token) return;

        const chat = new ChatSessionAPI();
        chatRef.current = chat;

        chat.start(token);

        chat.onWaiting(() => {
            setState({
                status: "WAITING",
                isConnecting: false,
                isError: false,
            });
        });

        chat.onMatchFound(({ sessionId }) => {
            setState({
                status: "MATCH_FOUND",
                isError: !sessionId,
                sessionId,
                isConnecting: false,
            });
        });

        chat.onAlreadyInSession(({ sessionId, startedAt }) => {
            setState({
                status: "ALREADY_IN_SESSION",
                isError: !sessionId || !startedAt,
                sessionId,
                startedAt,
                isConnecting: false
            });
        });

        return () => {
            chat.disconnect();
            chatRef.current = null;
        };
    }, [token]);

    return {
        ...state,
        chat: chatRef.current,
    };
}