import { Box, Container, Stack, Typography } from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import ForumIcon from "@mui/icons-material/Forum";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import TuneIcon from "@mui/icons-material/Tune";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTranslation } from "react-i18next";

const icons = [
    <PersonSearchIcon fontSize="small" />,
    <ForumIcon fontSize="small" />,
    <TuneIcon fontSize="small" />,
    <HourglassBottomIcon fontSize="small" />,
    <EmojiEventsIcon fontSize="small" />,
];

export function HowItWorksSection() {
    const {t} = useTranslation();
    
    const steps = (t("landingPage.howItWorks.steps", { returnObjects: true }) as {
        title: string;
        description: string;
    }[]).map((step, i) => ({ ...step, icon: icons[i] }));

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 10, md: 14 },
                backgroundColor: "background.paper",
                position: "relative",
                // Se a sombra está fora, precisamos garantir que o Box não esconda o que está fora dele
                overflow: "visible", 
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -80, // Mudou de 0 para -80 (joga para cima, fora da caixa)
                    left: 0,
                    right: 0,
                    height: 80,
                    background: "linear-gradient(to bottom, transparent, #0F1012)", // Inverti o degradê para casar com o fundo escuro de fora
                    pointerEvents: "none",
                },
                "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -80, // Mudou de 0 para -80 (joga para baixo, fora da caixa)
                    left: 0,
                    right: 0,
                    height: 80,
                    background: "linear-gradient(to top, transparent, #0F1012)", // Inverti o degradê para casar com o fundo escuro de fora
                    pointerEvents: "none",
                },
            }}
        >
            <Container maxWidth="lg">

                {/* Cabeçalho */}
                <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
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
                        {t("landingPage.howItWorks.suptitle")}
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: "1.8rem", md: "2.4rem" },
                            color: "text.primary",
                        }}
                    >
                        {t("landingPage.howItWorks.title")}
                    </Typography>
                </Box>

                {/* Steps */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(5, 1fr)",
                        },
                        gap: { xs: 0, md: 2 },
                        position: "relative",
                    }}
                >
                    {steps.map((step, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "row", md: "column" },
                                alignItems: { xs: "flex-start", md: "center" },
                                gap: { xs: 3, md: 2 },
                                textAlign: { xs: "left", md: "center" },
                                position: "relative",
                                pb: { xs: index < steps.length - 1 ? 6 : 0, md: 0 },
                            }}
                        >
                            {/* Linha conectora vertical (mobile) */}
                            {index < steps.length - 1 && (
                                <Box
                                    aria-hidden
                                    sx={{
                                        display: { xs: "block", md: "none" },
                                        position: "absolute",
                                        left: 19,
                                        top: 44,
                                        width: "1px",
                                        bottom: 0,
                                        bgcolor: "divider",
                                    }}
                                />
                            )}

                            {/* Ícone + número */}
                            <Stack
                                sx={{ 
                                    flexShrink: 0,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        border: "1px solid",
                                        borderColor: "primary.dark",
                                        bgcolor: "background.paper",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "primary.light",
                                        mb: { xs: 0, md: 1 },
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    {step.icon}
                                </Box>

                                {/* Linha conectora horizontal (desktop) */}
                                {index < steps.length - 1 && (
                                    <Box
                                        aria-hidden
                                        sx={{
                                            display: { xs: "none", md: "block" },
                                            position: "absolute",
                                            top: 20,
                                            left: "calc(50% + 20px)",
                                            width: "calc(100% - 40px)",
                                            height: "1px",
                                            bgcolor: "divider",
                                        }}
                                    />
                                )}
                            </Stack>

                            {/* Texto */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "primary.main",
                                        fontFamily: "monospace",
                                        letterSpacing: "0.06em",
                                        display: "block",
                                        mb: 0.5,
                                    }}
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: "text.primary",
                                        fontWeight: 500,
                                        mb: 0.75,
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {step.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        lineHeight: 1.6,
                                        fontSize: "0.82rem",
                                    }}
                                >
                                    {step.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}