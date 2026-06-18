import { Typography } from "@mui/material";
import type { LeaderboardColumn } from "../types/LeaderboardColumn";
import type { UserEntry } from "../types/UserEntry";

export const userColumns: LeaderboardColumn<UserEntry>[] = [
    { key: "username", label: "leaderboards.users.player" },
    { key: "score",    label: "leaderboards.users.score", align: "right" },
    {
        key: "winRate",
        label: "leaderboards.users.winrate",
        align: "right",
        render: (row) => (
            <Typography variant="body2" sx={{ color: "text.primary", fontSize: "0.875rem" }}>
                {row.winRate}%
            </Typography>
        ),
    },
    { key: "sessionsPlayed", label: "leaderboards.users.sessions", align: "right" },
];