import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

import { Box, Stack, Typography } from "@mui/material";
import { leaderboardStyles } from "../styles/Leaderboard.styles";
import { Leaderboard } from "./Leaderboard";
import type { ModelEntry } from "../types/ModelEntry";
import { modelColumns } from "../data/ModelColumns";
import { useTranslation } from "react-i18next";

const mockModels: ModelEntry[] = Array.from({ length: 8 }, (_, i) => ({
    id: `u${i}`,
    name: `model_${i + 1}`,
    score: 5000 - i * 400,
    winRate: Math.round((80 - i * 5) * 10) / 10,
    sessionsPlayed: 120 - i * 10,
}));

export function AIModelsLeaderboard() {
    const {t} = useTranslation();
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: "center" }}>
                    <EmojiEventsOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography variant="overline" sx={leaderboardStyles.mainTitle} >
                        {t("leaderboards.aimodels.title")}
                    </Typography>
                </Stack>
                <Typography variant="body2" sx={leaderboardStyles.mainSubtitle}>
                    {t("leaderboards.aimodels.subtitle")}
                </Typography>
            </Box>

            <Leaderboard  
                columns={modelColumns}
                rows={mockModels}
                rowKey={(row) => row.id}
            />
        </Box>
    );
}