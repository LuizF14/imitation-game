import { Box, Button, Card, CardContent, Chip, Container, Divider, Grid, Stack, Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RegisterModelModal } from "./RegisterModelModal";

export interface AIModel {
    id: string;
    name: string;
    sessionsPlayed: number;
    score: number;
    ranking: number | null;
    active: boolean;
}

interface Props {
    models: AIModel[];
}

export function ModelsSection({ models }: Props) {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
            <Container maxWidth="lg">

                {/* Cabeçalho */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ 
                        mb: 3,
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between"
                    }}
                >
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={1}>
                        <SmartToyOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography
                            variant="overline"
                            sx={{
                                color: "primary.main",
                                letterSpacing: "0.1em",
                                fontSize: "0.72rem",
                            }}
                        >
                            Your models
                        </Typography>
                    </Stack>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddOutlinedIcon />}
                        onClick={() => setModalOpen(true)}
                        sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            "&:hover": { bgcolor: "primary.dark" },
                            fontSize: "0.8rem",
                        }}
                    >
                        Register new model
                    </Button>
                </Stack>

                {/* Cards */}
                {models.length === 0 ? (
                    <Card
                        sx={{
                            p: 6,
                            textAlign: "center",
                            borderStyle: "dashed",
                            opacity: 0.5,
                        }}
                    >
                        <SmartToyOutlinedIcon sx={{ fontSize: 36, color: "text.disabled", mb: 1.5 }} />
                        <Typography variant="body2" sx={{ color: "text.disabled" }}>
                            No models yet. Register your first model to start competing.
                        </Typography>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {models.map((model) => (
                            <Grid size={{xs: 12, sm: 6, md: 4}} key={model.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition: "border-color 0.2s",
                                        "&:hover": { borderColor: "primary.dark" },
                                    }}
                                >
                                    <CardContent sx={{ flex: 1, p: 3 }}>

                                        {/* Nome + status */}
                                        <Stack
                                            direction="row"
                                            sx={{alignItems: "center", justifyContent: "space-between", mb: 2.5}}
                                        >
                                            <Typography
                                                variant="h5"
                                                sx={{ fontSize: "1rem", color: "text.primary" }}
                                            >
                                                {model.name}
                                            </Typography>
                                            <Chip
                                                label={model.active ? "Active" : "Inactive"}
                                                size="small"
                                                color={model.active ? "success" : "default"}
                                                sx={{ fontSize: "0.68rem", height: 20 }}
                                            />
                                        </Stack>

                                        <Divider sx={{ borderColor: "divider", mb: 2.5 }} />

                                        {/* Métricas */}
                                        <Grid container spacing={2}>
                                            <Grid size={{xs: 4}}>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 }}
                                                >
                                                    Score
                                                </Typography>
                                                <Typography
                                                    variant="h4"
                                                    sx={{ fontSize: "1.4rem", color: "text.primary", lineHeight: 1 }}
                                                >
                                                    {model.score}
                                                </Typography>
                                            </Grid>

                                            <Grid size={{xs: 4}}>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 }}
                                                >
                                                    Ranking
                                                </Typography>
                                                <Typography
                                                    variant="h4"
                                                    sx={{ fontSize: "1.4rem", color: "text.primary", lineHeight: 1 }}
                                                >
                                                    {model.ranking !== null ? `#${model.ranking}` : "—"}
                                                </Typography>
                                            </Grid>

                                            <Grid size={{xs: 4}}>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 }}
                                                >
                                                    Sessions
                                                </Typography>
                                                <Typography
                                                    variant="h4"
                                                    sx={{ fontSize: "1.4rem", color: "text.primary", lineHeight: 1 }}
                                                >
                                                    {model.sessionsPlayed}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>

                                    {/* CTA */}
                                    <Box sx={{ px: 3, pb: 3 }}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            endIcon={<ArrowForwardOutlinedIcon fontSize="small" />}
                                            onClick={() => navigate(`/aiprovider/models/${model.id}`)}
                                            sx={{
                                                borderColor: "primary.dark",
                                                color: "primary.light",
                                                fontSize: "0.82rem",
                                                "&:hover": {
                                                    borderColor: "primary.main",
                                                    bgcolor: "rgba(186, 117, 23, 0.06)",
                                                },
                                            }}
                                        >
                                            View detailed metrics
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <RegisterModelModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </Box>
    );
}