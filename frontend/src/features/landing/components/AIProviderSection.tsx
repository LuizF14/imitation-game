import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import AutoModeOutlinedIcon from "@mui/icons-material/AutoModeOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";

import {Box, Button, Container, Grid, Stack, Typography} from "@mui/material";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { aiProviderSectionStyles } from "../styles/AIProviderSection.styles";
import { APP_ROUTES } from "../../../app/router/appRoutes";

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
    const handleProviderLogin = () => { navigate(APP_ROUTES.AIPROVIDER_LOGIN); };

    const steps = (
        t("landingPage.aiProviderSection.steps", { returnObjects: true }) as {
            title: string;
            description: string;
        }[]
    ).map((step, i) => ({ ...step, icon: stepIcons[i] }));

    return (
        <Box component="section" sx={aiProviderSectionStyles.section} >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 6, md: 10 }} sx={{alignItems: "center"}} >
                    {/* Left side — text + steps */}
                    <Grid size={{xs: 12, md: 5}}>
                        <Typography variant="overline" sx={aiProviderSectionStyles.suptitle} >
                            {t("landingPage.aiProviderSection.suptitle")}
                        </Typography>

                        <Typography variant="h2" sx={aiProviderSectionStyles.title} >
                            {t("landingPage.aiProviderSection.title")}
                        </Typography>

                        <Typography variant="body1" sx={aiProviderSectionStyles.subtitle} >
                            {t("landingPage.aiProviderSection.subtitle")}
                        </Typography>

                        {/* Steps */}
                        <Stack spacing={3} sx={{ mb: 5 }}>
                            {steps.map((step, index) => (
                                <Stack key={index} sx={{alignItems: "flex-start"}} direction="row" spacing={2} >
                                    {/* Ícone */}
                                    <Box sx={aiProviderSectionStyles.boxIcon}>
                                        {step.icon}
                                    </Box>

                                    {/* Texto */}
                                    <Box>
                                        <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: "center" }}>
                                            <Typography variant="caption" sx={aiProviderSectionStyles.stepNumber} >
                                                {String(index + 1).padStart(2, "0")}
                                            </Typography>
                                            <Typography variant="subtitle2" sx={aiProviderSectionStyles.stepTitle} >
                                                {step.title}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={aiProviderSectionStyles.stepDescription} >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>

                        <Button variant="contained" size="large" onClick={handleProviderLogin} sx={aiProviderSectionStyles.registerModelBtn} >
                            {t("landingPage.aiProviderSection.cta")}
                        </Button>
                    </Grid>

                    {/* Right side — feature's grid */}
                    <Grid size={{xs: 12, md: 7}}>
                        <Grid container spacing={2}>
                            {featureKeys.map((key) => (
                                <Grid size={{xs: 12, sm: 6}} key={key}>
                                    <Box sx={aiProviderSectionStyles.featureBox} >
                                        <Box sx={aiProviderSectionStyles.featureIcon} >
                                            {featureIcons[key]}
                                        </Box>
                                        <Typography variant="subtitle2" sx={aiProviderSectionStyles.featureTitle} >
                                            {t(`landingPage.aiProviderSection.features.${key}.title`)}
                                        </Typography>
                                        <Typography variant="body2" sx={aiProviderSectionStyles.featureDescription} >
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