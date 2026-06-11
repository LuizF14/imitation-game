import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

interface StatCard {
    label: string;
    value: string | number;
    sub?: string;
}

interface Props {
    stats: {
        sessionsPlayed: number;
        winRate: number;       // 0–100
        avgTuringRate: number; // 0–1
        ranking: number | null;
    };
}

export function UserStatsSection({ stats }: Props) {
    const cards: StatCard[] = [
        {
            label: "Sessions played",
            value: stats.sessionsPlayed,
        },
        {
            label: "Win rate",
            value: `${stats.winRate.toFixed(1)}%`,
        },
        {
            label: "Avg Turing Rate received",
            value: stats.avgTuringRate.toFixed(2),
            sub: "0 = robot · 1 = human",
        },
        {
            label: "Global ranking",
            value: stats.ranking !== null ? `#${stats.ranking}` : "—",
        },
    ];

    return (
        <Box component="section" sx={{ py: { xs: 1, md: 3 } }}>
            <Container maxWidth="lg">

                <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
                    <TrendingUpOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography
                        variant="overline"
                        sx={{
                            color: "primary.main",
                            letterSpacing: "0.1em",
                            fontSize: "0.72rem",
                        }}
                    >
                        Your stats
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    {cards.map((card) => (
                        <Grid size={{xs: 6, md: 3}} key={card.label}>
                            <Box
                                sx={{
                                    p: 2.5,
                                    bgcolor: "background.paper",
                                    border: "0.5px solid",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    height: "100%",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: "0.75rem",
                                        display: "block",
                                        mb: 1,
                                    }}
                                >
                                    {card.label}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontSize: { xs: "1.4rem", md: "1.8rem" },
                                        color: "text.primary",
                                        lineHeight: 1,
                                        mb: card.sub ? 0.75 : 0,
                                    }}
                                >
                                    {card.value}
                                </Typography>
                                {card.sub && (
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.disabled", fontSize: "0.7rem" }}
                                    >
                                        {card.sub}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}