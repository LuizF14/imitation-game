import { Alert, Box, Container, Grid, Stack, Typography } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { userStatsStyles } from "../styles/UserStatsSection.styles";
import { UserStatCard, UserStatCardSkeleton } from "./UserStatCard";
import { useTranslation } from "react-i18next";
import { buildStatsCards, CARD_COUNT } from "../data/StatsCards";
import { useUserStats } from "../hooks/useUserStats";

export function UserStatsSection() {
    const {t} = useTranslation();
    const { data: stats, isLoading, isError } = useUserStats();

    const cards = stats ? buildStatsCards(stats) : null;

    return (
        <Box component="section" sx={{ py: { xs: 1, md: 3 } }}>
            <Container maxWidth="lg">
                <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
                    <TrendingUpOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography variant="overline" sx={userStatsStyles.title} >
                        {t("user.statsSection.yourStats")}
                    </Typography>
                </Stack>

                {isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {t("user.statsSection.error")}
                    </Alert>
                )}

                <Grid container spacing={2}>
                    {isLoading && Array.from({ length: CARD_COUNT }).map((_, i) => (
                            <Grid size={{ xs: 6, md: 3 }} key={i}>
                                <UserStatCardSkeleton />
                            </Grid>
                        ))}

                    {!isError && !isLoading && cards && cards.map((card) => (
                            <Grid size={{ xs: 6, md: 3 }} key={t(card.label)}>
                                <UserStatCard {...card} />
                            </Grid>
                        ))}
                </Grid>
            </Container>
        </Box>
    );
}