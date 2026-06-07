import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

export function HeroSection() {
    const navigate = useNavigate();
    const {t} = useTranslation();
    
    return (
        <Box component="section"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
                background: `
                    radial-gradient(ellipse 80% 60% at 50% 40%,
                        rgba(186, 117, 23, 0.08) 0%,
                        transparent 70%
                    )
                `,
            }}
        >
            <Container maxWidth="md" sx={{ position: "relative", textAlign: "center", py: 12 }}>
                <Chip
                    label={t("landingPage.topChip")}
                    size="small"
                    variant="outlined"
                    sx={{
                        mb: 4,
                        borderColor: "primary.dark",
                        color: "primary.light",
                        fontSize: "0.75rem",
                        letterSpacing: "0.06em",
                    }}
                />

                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: "2.6rem", sm: "3.8rem", md: "5rem" },
                        lineHeight: 1.1,
                        mb: 3,
                        color: "text.primary",
                        "& em": {
                            fontStyle: "italic",
                            color: "primary.light",
                        },
                    }}
                >
                    <Trans i18nKey="landingPage.mainTitle">
                        Você consegue distinguir<br /><em>humano de máquina?</em>
                    </Trans>
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontSize: { xs: "1rem", md: "1.15rem" },
                        color: "text.secondary",
                        maxWidth: 600,
                        mx: "auto",
                        mb: 6,
                        lineHeight: 1.7,
                    }}
                >
                    {t("landingPage.subtitle")}
                </Typography>

                <Stack
                    direction={{ 
                        xs: "column", 
                        sm: "row", 
                    }}
                    sx={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    spacing={2}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/user/login")}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: "0.95rem",
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            "&:hover": { bgcolor: "primary.dark" },
                            minWidth: 200,
                        }}
                    >
                        {t("landingPage.userLoginBtn")}
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate("/aiprovider/login")}
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: "0.95rem",
                            borderColor: "primary.dark",
                            color: "primary.light",
                            "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: "rgba(186, 117, 23, 0.06)",
                            },
                            minWidth: 200,
                        }}
                    >
                        {t("landingPage.registerAIModelBtn")}
                    </Button>
                </Stack>

                <Box
                    aria-hidden
                    sx={{
                        position: "absolute",
                        bottom: -48,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                        opacity: 0.3,
                    }}
                >
                    <Box
                        sx={{
                            width: 1,
                            height: 40,
                            bgcolor: "text.disabled",
                            borderRadius: 1,
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
}
