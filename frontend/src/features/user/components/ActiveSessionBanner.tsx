import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { useNavigate } from "react-router-dom";
import { activeSessionStyles } from "../styles/ActiveSessionBanner.styles";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "../../../app/router/appRoutes";
import { useActiveSession } from "../hooks/useActiveSession";
import { useSessionCountdown } from "../hooks/useSessionCountdown";

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export function ActiveSessionBanner() {
    const navigate = useNavigate();
    const {t} = useTranslation();

    const {data, isError, isLoading} = useActiveSession();
    if (isError || isLoading) return;   
    const { secondsLeft, isExpired } = useSessionCountdown(data?.startedAt);

    return (
        <Box sx={isExpired? activeSessionStyles.finishedBox : activeSessionStyles.activeBox} >
            <Container maxWidth="lg">
                <Stack direction={{ xs: "column", sm: "row" }} sx={{alignItems: {xs: "flex-start", sm: "center"}, justifyContent: "space-between" }} spacing={2} >
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={2}>
                        <Chip size="small" label={isExpired? t("user.activeSessionBanner.finishedSession") : t("user.activeSessionBanner.activeSession")} color={isExpired? "warning": "success"} sx={{ fontSize: "0.72rem" }} />
                        <Typography variant="body2" sx={{ color: "text.primary" }}>
                            {t("user.activeSessionBanner.chatDuel")}
                        </Typography>
                        {!isExpired && (
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
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
                        )}
                    </Stack>

                    <Button
                        variant="contained"
                        size="small"
                        color={isExpired ? "warning" : "primary"}
                        onClick={() => navigate(APP_ROUTES.CHAT_SESSION)}
                        sx={{ flexShrink: 0 }}
                    >
                        {isExpired
                            ? t("user.activeSessionBanner.viewResult")
                            : t("user.activeSessionBanner.resumeSession")}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}