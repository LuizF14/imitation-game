import { Typography } from "@mui/material";
import type { LeaderboardColumn } from "../types/LeaderboardColumn";
import type { ModelEntry } from "../types/ModelEntry";

export const modelColumns: LeaderboardColumn<ModelEntry>[] = [
    { key: "name", label: "leaderboards.aimodels.name" },
    { key: "score",    label: "leaderboards.aimodels.score", align: "right" },
    {
        key: "winRate",
        label: "leaderboards.aimodels.winrate",
        align: "right",
        render: (row) => (
            <Typography variant="body2" sx={{ color: "text.primary", fontSize: "0.875rem" }}>
                {row.winRate}%
            </Typography>
        ),
    },
    { key: "sessionsPlayed", label: "leaderboards.aimodels.sessions", align: "right" },
];