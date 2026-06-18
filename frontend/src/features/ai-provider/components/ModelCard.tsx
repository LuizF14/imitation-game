import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ImageSearchOutlinedIcon from "@mui/icons-material/ImageSearchOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { generatePath, useNavigate } from "react-router-dom";
import type { AIModel } from "../types/AIModel";
import { modelCardStyles } from "../styles/ModelCard.syles";
import { modelsSectionStyles } from "../styles/ModelsSection.styles";
import { useTranslation } from "react-i18next";
import { APP_ROUTES } from "../../../app/router/appRoutes";

interface ModelCardProps {
    model: AIModel;
}

export function ModelCard({model} : ModelCardProps) {
    const navigate = useNavigate();
    const {t} = useTranslation();

    function handleDetailedModel() {
        navigate(generatePath(APP_ROUTES.AIPROVIDER_MODEL_DETAILS, { id: String(model.id) }));
    }

    return (
        <Grid size={{xs: 12, sm: 6, md: 4}} key={model.id}>
            <Card sx={modelCardStyles.mainContainer} >
                <CardContent sx={modelCardStyles.cardContent}>
                    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                        <Stack direction="row" sx={{alignItems: "center"}} spacing={1}>
                            <Box sx={{ color: "text.disabled" }}>
                                {model.type === "Chat"
                                    ? <ForumOutlinedIcon sx={{ fontSize: 16 }} />
                                    : <ImageSearchOutlinedIcon sx={{ fontSize: 16 }} />
                                }
                            </Box>
                            <Typography variant="h5" sx={{ fontSize: "1rem", color: "text.primary" }}>
                                {model.name}
                            </Typography>
                        </Stack>
                        <Chip label={model.active ? "Active" : "Inactive"} size="small" color={model.active ? "success" : "default"} sx={modelCardStyles.modelStatus} />
                    </Stack>

                    <Divider sx={{ borderColor: "divider", mb: 2.5 }} />

                    {/* Métricas */}
                    <Grid container spacing={2}>
                        <Grid size={{xs: 4}}>
                            <Typography variant="caption" sx={modelCardStyles.metricSuptitle} >
                                {t("aiprovider.modelsSection.modelCard.score")}
                            </Typography>
                            <Typography variant="h4" sx={modelCardStyles.metricStatus} >
                                {model.score}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 4}}>
                            <Typography variant="caption" sx={modelCardStyles.metricSuptitle} >
                                {t("aiprovider.modelsSection.modelCard.ranking")}
                            </Typography>
                            <Typography variant="h4" sx={modelCardStyles.metricStatus} >
                                {model.ranking !== null ? `#${model.ranking}` : "—"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 4}}>
                            <Typography variant="caption" sx={modelCardStyles.metricSuptitle} >
                                {t("aiprovider.modelsSection.modelCard.sessions")}
                            </Typography>
                            <Typography variant="h4" sx={modelCardStyles.metricStatus} >
                                {model.sessionsPlayed}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>

                <Box sx={{ px: 3, pb: 3 }}>
                    <Button variant="outlined" fullWidth endIcon={<ArrowForwardOutlinedIcon fontSize="small" />} onClick={handleDetailedModel} sx={modelsSectionStyles.viewDetailedMetricsBtn} >
                        {t("aiprovider.modelsSection.modelCard.viewDetailedMetrics")}
                    </Button>
                </Box>
            </Card>
        </Grid>
    );
}