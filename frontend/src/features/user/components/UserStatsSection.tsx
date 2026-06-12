import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { userStatsStyles } from "../styles/UserStatsSection.styles";
import { UserStatCard } from "./UserStatCard";
import type { UserStatCardProps } from "./UserStatCard";
import { useTranslation } from "react-i18next";

interface Props {
    stats: {
        sessionsPlayed: number;
        winRate: number;       // 0–100
        avgTuringRate: number; // 0–1
        ranking: number | null;
    };
}

function buildStatsCards(stats: Props["stats"]): UserStatCardProps[] { 
    return [
        {
            label: "user.statsSection.sessionsPlayed",
            value: stats.sessionsPlayed,
        },
        {
            label: "user.statsSection.winRate",
            value: `${stats.winRate.toFixed(1)}%`,
        },
        {
            label: "user.statsSection.avgTuringRate",
            value: stats.avgTuringRate.toFixed(2),
            subtitle: "user.statsSection.turingRateSubtitle",
        },
        {
            label: "user.statsSection.globalRanking",
            value: stats.ranking !== null ? `#${stats.ranking}` : "—",
        },
    ]
}

export function UserStatsSection({ stats }: Props) {
    const {t} = useTranslation();
    const cards = buildStatsCards(stats);

    return (
        <Box component="section" sx={{ py: { xs: 1, md: 3 } }}>
            <Container maxWidth="lg">

                <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
                    <TrendingUpOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography variant="overline" sx={userStatsStyles.title} >
                        Your stats
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    {cards.map((card) => (
                        <Grid size={{ xs: 6, md: 3 }} key={t(card.label)} >
                            <UserStatCard {...card} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}