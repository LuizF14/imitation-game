import {Box, Button, Container, Grid, Stack, Typography} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import AutoModeOutlinedIcon from "@mui/icons-material/AutoModeOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";

const stepIcons = [
    <AccountCircleOutlinedIcon fontSize="small" />,
    <VpnKeyOutlinedIcon fontSize="small" />,
    <AutoModeOutlinedIcon fontSize="small" />,
];

const featureIcons: Record<string, React.ReactNode> = {
    matchmaking: <SyncAltOutlinedIcon fontSize="small" />,
    analytics:   <BarChartOutlinedIcon fontSize="small" />,
    ranking:     <LeaderboardOutlinedIcon fontSize="small" />,
    apiKey:      <IntegrationInstructionsOutlinedIcon fontSize="small" />,
};

const featureKeys = ["matchmaking", "analytics", "ranking", "apiKey"] as const;

export function AIProviderSection() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const steps = (
        t("landingPage.aiProviderSection.steps", { returnObjects: true }) as {
            title: string;
            description: string;
        }[]
    ).map((step, i) => ({ ...step, icon: stepIcons[i] }));

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 10, md: 14 },
                position: "relative",
                // Glow sutil do lado esquerdo pra dar personalidade diferente do Hero
                background: `
                    radial-gradient(ellipse 60% 60% at 20% 50%,
                        rgba(186, 117, 23, 0.06) 0%,
                        transparent 70%
                    )
                `,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 6, md: 10 }} sx={{alignItems: "center"}} >

                    {/* Lado esquerdo — texto + steps */}
                    <Grid size={{xs: 12, md: 5}}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: "primary.main",
                                letterSpacing: "0.12em",
                                fontSize: "0.72rem",
                                display: "block",
                                mb: 1.5,
                            }}
                        >
                            {t("landingPage.aiProviderSection.suptitle")}
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: "1.8rem", md: "2.4rem" },
                                color: "text.primary",
                                mb: 2,
                            }}
                        >
                            {t("landingPage.aiProviderSection.title")}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "text.secondary",
                                mb: 5,
                                lineHeight: 1.7,
                                fontSize: "0.95rem",
                            }}
                        >
                            {t("landingPage.aiProviderSection.subtitle")}
                        </Typography>

                        {/* Steps */}
                        <Stack spacing={3} sx={{ mb: 5 }}>
                            {steps.map((step, index) => (
                                <Stack key={index} sx={{alignItems: "flex-start"}} direction="row" spacing={2} >
                                    {/* Ícone */}
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            border: "1px solid",
                                            borderColor: "primary.dark",
                                            bgcolor: "background.paper",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "primary.light",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {step.icon}
                                    </Box>

                                    {/* Texto */}
                                    <Box>
                                        <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: "center" }}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "primary.main",
                                                    fontFamily: "monospace",
                                                    letterSpacing: "0.06em",
                                                }}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ color: "text.primary", fontWeight: 500 }}
                                            >
                                                {step.title}
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "text.secondary", lineHeight: 1.6 }}
                                        >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/aiprovider/login")}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "0.95rem",
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": { bgcolor: "primary.dark" },
                            }}
                        >
                            {t("landingPage.aiProviderSection.cta")}
                        </Button>
                    </Grid>

                    {/* Lado direito — grid de features */}
                    <Grid size={{xs: 12, md: 7}}>
                        <Grid container spacing={2}>
                            {featureKeys.map((key) => (
                                <Grid size={{xs: 12, sm: 6}} key={key}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            height: "100%",
                                            bgcolor: "background.paper",
                                            border: "0.5px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            transition: "border-color 0.2s",
                                            "&:hover": {
                                                borderColor: "primary.dark",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 1.5,
                                                bgcolor: "rgba(186, 117, 23, 0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "primary.light",
                                                mb: 2,
                                            }}
                                        >
                                            {featureIcons[key]}
                                        </Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ color: "text.primary", fontWeight: 500, mb: 0.75 }}
                                        >
                                            {t(`landingPage.aiProviderSection.features.${key}.title`)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "0.82rem" }}
                                        >
                                            {t(`landingPage.aiProviderSection.features.${key}.description`)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}