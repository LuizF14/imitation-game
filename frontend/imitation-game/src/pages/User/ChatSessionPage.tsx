import { Avatar, Box, Button, Chip, Dialog, DialogContent, Divider, IconButton, InputBase, Slider, Stack, Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userTheme } from "../../theme/userTheme";
import { Navbar } from "../../components/Navbar";

// --- Tipos ---
interface Message {
    id: string;
    from: "me" | "opponent";
    text: string;
    timestamp: Date;
}

interface SessionResult {
    won: boolean;
    opponentType: "Human" | "AI";
    opponentName: string;
    pointsEarned: number;
    turingRateReceived: number;
}

// --- Constantes ---
const SESSION_DURATION = 5 * 60; // 5 minutos em segundos

// --- Mock: simula resultado ao fim da sessão ---
function mockGetResult(turingRateGiven: number): SessionResult {
    return {
        won: Math.random() > 0.4,
        opponentType: Math.random() > 0.5 ? "AI" : "Human",
        opponentName: Math.random() > 0.5 ? "Chameleon-7B" : "anonymous_user_42",
        pointsEarned: Math.floor(Math.random() * 200) + 50,
        turingRateReceived: Math.round(Math.random() * 10) / 10,
    };
}

// --- Helpers ---
function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function formatTimestamp(date: Date) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// --- Mock messages iniciais ---
const initialMessages: Message[] = [
    {
        id: "1",
        from: "opponent",
        text: "Hello! Ready to play?",
        timestamp: new Date(),
    },
];

// --- Componente principal ---
export function ChatSessionPage() {
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [turingRate, setTuringRate] = useState<number>(0.5);
    const [secondsLeft, setSecondsLeft] = useState(SESSION_DURATION);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [result, setResult] = useState<SessionResult | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll automático ao fim das mensagens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Countdown
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

    function handleSend() {
        const text = input.trim();
        if (!text || sessionEnded) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            from: "me",
            text,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setInput("");

        // Mock: oponente responde após delay
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

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const isUrgent = secondsLeft <= 60;

    return (
        <ThemeProvider theme={userTheme}>
            <CssBaseline />
            <Navbar />

            {/* Layout: ocupa o restante da viewport abaixo da Navbar */}
            <Box
                sx={{
                    height: "calc(100vh - 64px)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* Barra de sessão */}
                <Box
                    sx={{
                        px: 3,
                        py: 1.25,
                        borderBottom: "0.5px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexShrink: 0,
                    }}
                >
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={1.5}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor: "background.paper",
                                border: "0.5px solid",
                                borderColor: "divider",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "text.disabled",
                            }}
                        >
                            <PersonOutlinedIcon sx={{ fontSize: 16 }} />
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, lineHeight: 1 }}>
                                Anonymous opponent
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem" }}>
                                Human or AI? You decide.
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Countdown */}
                    <Chip
                        label={formatTime(secondsLeft)}
                        size="small"
                        sx={{
                            fontFamily: "monospace",
                            fontWeight: 600,
                            fontSize: "0.82rem",
                            bgcolor: isUrgent ? "error.dark" : "background.paper",
                            color: isUrgent ? "error.contrastText" : "text.secondary",
                            border: "0.5px solid",
                            borderColor: isUrgent ? "error.main" : "divider",
                            transition: "all 0.3s",
                        }}
                    />
                </Box>

                {/* Mensagens */}
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
                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            sx={{
                                display: "flex",
                                justifyContent: msg.from === "me" ? "flex-end" : "flex-start",
                            }}
                        >
                            <Stack
                                direction={msg.from === "me" ? "row-reverse" : "row"}
                                spacing={1}
                                sx={{ alignItems: "flex-end",maxWidth: { xs: "85%", md: "60%" } }}
                            >
                                {/* Avatar */}
                                <Avatar
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        bgcolor: msg.from === "me" ? "primary.dark" : "background.paper",
                                        border: "0.5px solid",
                                        borderColor: "divider",
                                        flexShrink: 0,
                                    }}
                                >
                                    <PersonOutlinedIcon sx={{ fontSize: 14, color: msg.from === "me" ? "primary.contrastText" : "text.disabled" }} />
                                </Avatar>

                                {/* Bubble */}
                                <Box>
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1.25,
                                            borderRadius: msg.from === "me"
                                                ? "12px 12px 2px 12px"
                                                : "12px 12px 12px 2px",
                                            bgcolor: msg.from === "me" ? "primary.dark" : "background.paper",
                                            border: "0.5px solid",
                                            borderColor: msg.from === "me" ? "primary.dark" : "divider",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: msg.from === "me" ? "primary.contrastText" : "text.primary",
                                                lineHeight: 1.5,
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {msg.text}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.disabled",
                                            fontSize: "0.68rem",
                                            display: "block",
                                            mt: 0.5,
                                            textAlign: msg.from === "me" ? "right" : "left",
                                        }}
                                    >
                                        {formatTimestamp(msg.timestamp)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Input + Turing Rate — fixo no fundo */}
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
                    {/* Turing Rate */}
                    <Box sx={{ mb: 2 }}>
                        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                                Turing Rate
                            </Typography>
                            <Stack direction="row" sx={{alignItems: "center"}} spacing={1}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontFamily: "monospace",
                                        fontWeight: 600,
                                        color: "primary.light",
                                        fontSize: "0.82rem",
                                    }}
                                >
                                    {turingRate.toFixed(1)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem" }}>
                                    {turingRate === 0 ? "— definitely a robot" : turingRate === 1 ? "— definitely human" : turingRate < 0.4 ? "— likely a robot" : turingRate > 0.6 ? "— likely human" : "— uncertain"}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack direction="row" sx={{alignItems: "center"}} spacing={2}>
                            <SmartToyOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
                            <Slider
                                value={turingRate}
                                onChange={(_, val) => setTuringRate(val as number)}
                                min={0}
                                max={1}
                                step={0.1}
                                disabled={sessionEnded}
                                sx={{
                                    color: "primary.main",
                                    "& .MuiSlider-thumb": {
                                        width: 16,
                                        height: 16,
                                        "&:hover": { boxShadow: "0 0 0 6px rgba(186,117,23,0.16)" },
                                    },
                                    "& .MuiSlider-rail": { opacity: 0.2 },
                                }}
                            />
                            <PersonOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
                        </Stack>
                    </Box>

                    <Divider sx={{ borderColor: "divider", mb: 2 }} />

                    {/* Input de mensagem */}
                    <Stack direction="row" sx={{alignItems: "flex-end"}} spacing={1}>
                        <Box
                            sx={{
                                flex: 1,
                                bgcolor: "background.default",
                                border: "0.5px solid",
                                borderColor: "divider",
                                borderRadius: 2,
                                px: 2,
                                py: 1.25,
                                "&:focus-within": { borderColor: "primary.dark" },
                                transition: "border-color 0.2s",
                            }}
                        >
                            <InputBase
                                fullWidth
                                multiline
                                maxRows={4}
                                placeholder={sessionEnded ? "Session ended." : "Type a message..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={sessionEnded}
                                sx={{
                                    fontSize: "0.875rem",
                                    color: "text.primary",
                                    "& textarea::placeholder": { color: "text.disabled" },
                                }}
                            />
                        </Box>

                        <IconButton
                            onClick={handleSend}
                            disabled={!input.trim() || sessionEnded}
                            sx={{
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                width: 40,
                                height: 40,
                                flexShrink: 0,
                                "&:hover": { bgcolor: "primary.dark" },
                                "&.Mui-disabled": { bgcolor: "background.paper", color: "text.disabled" },
                            }}
                        >
                            <SendOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>

            {/* Modal de resultado */}
            {result && (
                <ResultModal
                    result={result}
                    turingRateGiven={turingRate}
                    onClose={() => navigate("/user/home")}
                />
            )}
        </ThemeProvider>
    );
}

// --- Modal de resultado ---
interface ResultModalProps {
    result: SessionResult;
    turingRateGiven: number;
    onClose: () => void;
}

function ResultModal({ result, turingRateGiven, onClose }: ResultModalProps) {
    return (
        <Dialog
            open
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                sx: {
                    bgcolor: 'background.paper', // or your string
                    backgroundImage: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                },
                },
            }}
        >
            <DialogContent sx={{ px: 3, py: 4 }}>
                <Stack sx={{alignItems: "center"}} spacing={3}>

                    {/* Ícone de resultado */}
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: result.won ? "rgba(46,125,50,0.12)" : "rgba(211,47,47,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: result.won ? "success.main" : "error.main",
                        }}
                    >
                        {result.won
                            ? <EmojiEventsOutlinedIcon sx={{ fontSize: 28 }} />
                            : <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 28 }} />
                        }
                    </Box>

                    {/* Título */}
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h3" sx={{ fontSize: "1.4rem", mb: 0.5 }}>
                            {result.won ? "You won!" : "You lost."}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            The session has ended.
                        </Typography>
                    </Box>

                    <Divider sx={{ borderColor: "divider", width: "100%" }} />

                    {/* Revelação do oponente */}
                    <Box
                        sx={{
                            width: "100%",
                            p: 2,
                            bgcolor: "background.default",
                            border: "0.5px solid",
                            borderColor: "divider",
                            borderRadius: 1.5,
                        }}
                    >
                        <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 1.5 }}>
                            YOUR OPPONENT WAS
                        </Typography>
                        <Stack direction="row" sx={{alignItems: "center"}} spacing={1.5}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    bgcolor: "background.paper",
                                    border: "0.5px solid",
                                    borderColor: "divider",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.disabled",
                                }}
                            >
                                {result.opponentType === "AI"
                                    ? <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
                                    : <PersonOutlinedIcon sx={{ fontSize: 16 }} />
                                }
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, lineHeight: 1 }}>
                                    {result.opponentName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.72rem" }}>
                                    {result.opponentType}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Métricas */}
                    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                        <Box
                            sx={{
                                flex: 1,
                                p: 2,
                                bgcolor: "background.default",
                                border: "0.5px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 }}>
                                Points earned
                            </Typography>
                            <Typography variant="h4" sx={{ fontSize: "1.4rem", color: result.won ? "success.main" : "text.primary" }}>
                                +{result.pointsEarned}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                p: 2,
                                bgcolor: "background.default",
                                border: "0.5px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 }}>
                                Turing Rate given
                            </Typography>
                            <Typography variant="h4" sx={{ fontSize: "1.4rem", color: "text.primary", fontFamily: "monospace" }}>
                                {turingRateGiven.toFixed(1)}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                p: 2,
                                bgcolor: "background.default",
                                border: "0.5px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 }}>
                                Turing Rate received
                            </Typography>
                            <Typography variant="h4" sx={{ fontSize: "1.4rem", color: "text.primary", fontFamily: "monospace" }}>
                                {result.turingRateReceived.toFixed(1)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={onClose}
                        sx={{
                            py: 1.25,
                            borderColor: "primary.dark",
                            color: "primary.light",
                            "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: "rgba(186, 117, 23, 0.06)",
                            },
                        }}
                    >
                        Back to home
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}