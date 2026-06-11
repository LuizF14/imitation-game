import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography,
} from "@mui/material";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ImageSearchOutlinedIcon from "@mui/icons-material/ImageSearchOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import { useNavigate } from "react-router-dom";

interface GameMode {
    key: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    detail: string;
    route: string;
    available: boolean;
}

const gameModes: GameMode[] = [
    {
        key: "chat",
        icon: <ForumOutlinedIcon sx={{ fontSize: 32 }} />,
        label: "Chat Duel",
        description: "1v1 conversation against an unknown opponent.",
        detail: "Exchange messages for 5 minutes. Rate your opponent with the Turing Rate. Human or machine — you decide.",
        route: "/user/session/chat/new",
        available: true,
    },
    {
        key: "image",
        icon: <ImageSearchOutlinedIcon sx={{ fontSize: 32 }} />,
        label: "Image Classification",
        description: "Can you tell AI-generated from human-made?",
        detail: "Analyze images and classify them as AI-generated or human-created. Test your eye against the machine.",
        route: "/user/session/image/new",
        available: true,
    },
];

export function GameModesSection() {
    const navigate = useNavigate();

    return (
        <Box component="section" sx={{ py: { xs: 4, md: 1 } }}>
            <Container maxWidth="lg">

                {/* Cabeçalho */}
                <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
                    <BoltOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography
                        variant="overline"
                        sx={{
                            color: "primary.main",
                            letterSpacing: "0.1em",
                            fontSize: "0.72rem",
                        }}
                    >
                        Play
                    </Typography>
                </Stack>

                {/* Grid de modos — preparado para mais modos futuramente */}
                <Grid container spacing={3}>
                    {gameModes.map((mode) => (
                        <Grid size={{xs: 12, sm: 6, md: 4}}  key={mode.key}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    transition: "border-color 0.2s",
                                    cursor: mode.available ? "default" : "not-allowed",
                                    opacity: mode.available ? 1 : 0.5,
                                    "&:hover": mode.available
                                        ? { borderColor: "primary.dark" }
                                        : {},
                                }}
                            >
                                <CardContent sx={{ flex: 1, p: 3 }}>
                                    {/* Ícone */}
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            bgcolor: "rgba(186, 117, 23, 0.08)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "primary.light",
                                            mb: 2.5,
                                        }}
                                    >
                                        {mode.icon}
                                    </Box>

                                    {/* Label + chip */}
                                    <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
                                        <Typography variant="h5" sx={{ fontSize: "1.1rem" }}>
                                            {mode.label}
                                        </Typography>
                                        {!mode.available && (
                                            <Chip
                                                label="Soon"
                                                size="small"
                                                sx={{ fontSize: "0.68rem", height: 18 }}
                                            />
                                        )}
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: "text.secondary", mb: 1.5, fontWeight: 400 }}
                                    >
                                        {mode.description}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "text.disabled",
                                            fontSize: "0.8rem",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {mode.detail}
                                    </Typography>
                                </CardContent>

                                {/* CTA */}
                                <Box sx={{ px: 3, pb: 3 }}>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        disabled={!mode.available}
                                        onClick={() => navigate(mode.route)}
                                        sx={{
                                            borderColor: "primary.dark",
                                            color: "primary.light",
                                            "&:hover": {
                                                borderColor: "primary.main",
                                                bgcolor: "rgba(186, 117, 23, 0.06)",
                                            },
                                        }}
                                    >
                                        Start session
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}

                    {/* Slot vazio — indica que mais modos virão */}
                    <Grid size={{xs: 12, sm: 6, md: 4}}>
                        <Card
                            sx={{
                                height: "100%",
                                minHeight: 240,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderStyle: "dashed",
                                opacity: 0.4,
                                cursor: "default",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ color: "text.disabled", fontSize: "0.8rem" }}
                            >
                                More modes coming soon
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}