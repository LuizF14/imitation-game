import { Box, Divider } from "@mui/material";
import { ChatTimerBanner } from "../components/ChatTimerBanner";
import { MessageBubble } from "../components/MessageBubble";
import { TuringRateSlider } from "../components/TuringRateSlider";
import { MessageInput } from "../components/MessageInput";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/Message";

interface Props {
    secondsLeft: number;
    messages: Message[];
    turingRate: number;
    setTuringRate: (n: number) => void;
    sessionEnded: boolean;
    handleSend: (s: string) => void; 
}

export function ChatSession({secondsLeft, messages, turingRate, setTuringRate, sessionEnded, handleSend} : Props) {
    const [ input, setInput ] = useState("");
    const isUrgent = secondsLeft <= 60;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <ChatTimerBanner isUrgent={isUrgent} secondsLeft={secondsLeft} />

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: { xs: 2, md: 4 },
                    py: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                {messages.map((msg: Message) => (
                    <MessageBubble msg={msg} key={msg.id} />
                ))}
                <div ref={messagesEndRef} />
            </Box>

            <Box
                sx={{
                    flexShrink: 0,
                    borderTop: "0.5px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    px: { xs: 2, md: 4 },
                    pt: 2,
                    pb: 3,
                }}
            >
                <TuringRateSlider turingRate={turingRate} setTuringRate={setTuringRate} sessionEnded={sessionEnded} />
                <Divider sx={{ borderColor: "divider", mb: 2 }} />
                <MessageInput input={input} setInput={setInput} handleSend={handleSend} sessionEnded={sessionEnded} />
            </Box>
        </Box>
    );
}