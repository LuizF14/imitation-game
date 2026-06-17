import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { Box, Chip, Stack, Typography } from "@mui/material";
import { chatTimerBannerStyles } from "../styles/ChatTimerBanner.styles";
import { useTranslation } from "react-i18next";

interface Props {
    isUrgent: boolean;
    secondsLeft: number;
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export function ChatTimerBanner({isUrgent, secondsLeft}: Props) {
    const {t} = useTranslation();
    return (
        <Box sx={chatTimerBannerStyles.container} >
            <Stack direction="row" sx={{alignItems: "center"}} spacing={1.5}>
                <Box sx={chatTimerBannerStyles.iconContainer} >
                    <PersonOutlinedIcon sx={{ fontSize: 16 }} />
                </Box>
                <Box>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, lineHeight: 1 }}>
                        {t("chatsession.chatTimerBanner.anonymousOpponent")}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem" }}>
                        {t("chatsession.chatTimerBanner.humanOrAi")}
                    </Typography>
                </Box>
            </Stack>

            <Chip
                label={formatTime(secondsLeft)}
                size="small"
                sx={{
                    ...chatTimerBannerStyles.counterChip,
                    bgcolor: isUrgent ? "error.dark" : "background.paper",
                    color: isUrgent ? "error.contrastText" : "text.secondary",
                    borderColor: isUrgent ? "error.main" : "divider",
                    transition: "all 0.3s",
                }}
            />
        </Box>
    );
}