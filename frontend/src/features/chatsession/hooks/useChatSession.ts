import { useEffect, useState } from "react";
import type { Message } from "../types/Message";
import type { SessionResult } from "../types/SessionResult";

const SESSION_DURATION = 5 * 60; // 5 minutos em segundos

const initialMessages: Message[] = [
    {
        id: "1",
        from: "opponent",
        text: "Hello! Ready to play?",
        timestamp: new Date(),
    },
];

function mockGetResult(turingRateGiven: number): SessionResult {
    return {
        won: Math.random() > 0.4,
        opponentType: Math.random() > 0.5 ? "AI" : "Human",
        opponentName: Math.random() > 0.5 ? "Chameleon-7B" : "anonymous_user_42",
        pointsEarned: Math.floor(Math.random() * 200) + 50,
        turingRateReceived: Math.round(Math.random() * 10) / 10,
    };
}

export function useChatSession() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [turingRate, setTuringRate] = useState<number>(0.5);
    const [secondsLeft, setSecondsLeft] = useState(SESSION_DURATION);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [result, setResult] = useState<SessionResult | null>(null);

    useEffect(() => {
        if (sessionEnded) return;

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSessionEnd();
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionEnded]);


    function handleSessionEnd() {
        setSessionEnded(true);
        setResult(mockGetResult(turingRate));
    }

    function handleSend(text: string) {
        const newMessage: Message = {
            id: Date.now().toString(),
            from: "me",
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString() + "_opp",
                    from: "opponent",
                    text: "Interesting... tell me more.",
                    timestamp: new Date(),
                },
            ]);
        }, 1200);
    }

    return {
        messages,
        turingRate,
        setTuringRate,
        secondsLeft,
        sessionEnded,
        handleSend,
        result
    };
}