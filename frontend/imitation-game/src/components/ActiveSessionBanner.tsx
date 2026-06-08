import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { useNavigate } from "react-router-dom";

interface Props {
    sessionId: string;
    mode: "chat" | "image";
    secondsLeft: number;
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export function ActiveSessionBanner({ sessionId, mode, secondsLeft }: Props) {
    const navigate = useNavigate();

    const modeLabel = mode === "chat" ? "Chat Duel" : "Image Classification";

    return (
        <Box
            sx={{
                borderBottom: "0.5px solid",
                borderColor: "primary.dark",
                bgcolor: "rgba(var(--active-session-color, 29, 158, 117), 0.06)",
                py: 1.5,
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    sx={{alignItems: {xs: "flex-start", sm: "center"}, 
                    justifyContent: "space-between"  
                    }}
                    spacing={2}
                >
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={2}>
                        <Chip
                            size="small"
                            label="Active session"
                            color="success"
                            sx={{ fontSize: "0.72rem" }}
                        />
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                            {modeLabel}
                        </Typography>
                        <Stack direction="row"spacing={0.5} sx={{alignItems: "center"}}>
                            <TimerOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: secondsLeft < 60 ? "error.main" : "text.secondary",
                                    fontFamily: "monospace",
                                    fontWeight: 500,
                                }}
                            >
                                {formatTime(secondsLeft)}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/user/session/${sessionId}`)}
                        sx={{ flexShrink: 0 }}
                    >
                        Resume session
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}