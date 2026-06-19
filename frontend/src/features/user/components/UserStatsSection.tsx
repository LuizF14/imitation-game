import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { userStatsStyles } from "../styles/UserStatsSection.styles";
import { UserStatCard } from "./UserStatCard";
import { useTranslation } from "react-i18next";
import { buildStatsCards } from "../data/StatsCards";

export interface UserStatsProps {
    stats: {
        sessionsPlayed: number;
        score: number;      
        avgTuringRate: number; // 0–1
        ranking: number | null;
    };
}

export function UserStatsSection({ stats }: UserStatsProps) {
    const {t} = useTranslation();
    const cards = buildStatsCards(stats);

    return (
        <Box component="section" sx={{ py: { xs: 1, md: 3 } }}>
            <Container maxWidth="lg">

                <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
                    <TrendingUpOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography variant="overline" sx={userStatsStyles.title} >
                        {t("user.statsSection.yourStats")}
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