import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { useNavigate } from "react-router-dom";
import { activeSessionStyles } from "../styles/ActiveSessionBanner.styles";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "../../../app/router/appRoutes";

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

export function ActiveSessionBanner({ mode, secondsLeft }: Props) {
    const navigate = useNavigate();
    const {t} = useTranslation();

    const modeLabel = mode === "chat" ? "Chat Duel" : "Image Classification";
    const modeRoute = mode === "chat" ? APP_ROUTES.CHAT_SESSION : APP_ROUTES.IMAGE_SESSION;

    return (
        <Box sx={activeSessionStyles.box} >
            <Container maxWidth="lg">
                <Stack direction={{ xs: "column", sm: "row" }} sx={{alignItems: {xs: "flex-start", sm: "center"}, justifyContent: "space-between" }} spacing={2} >
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={2}>
                        <Chip size="small" label="Active session" color="success" sx={{ fontSize: "0.72rem" }} />
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                            {modeLabel}
                        </Typography>
                        <Stack direction="row"spacing={0.5} sx={{alignItems: "center"}}>
                            <TimerOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" sx={{ color: secondsLeft < 60 ? "error.main" : "text.secondary", fontFamily: "monospace", fontWeight: 500}} >
                                {formatTime(secondsLeft)}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Button variant="contained" size="small" onClick={() => navigate(modeRoute)} sx={{ flexShrink: 0 }} >
                        {t("user.activeSessionBanner.resumeSession")}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}