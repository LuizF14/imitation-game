import { useTranslation, Trans } from "react-i18next";

import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";

import { heroStyles } from "./HeroSection.styles";

import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../app/router/appRoutes";

export function HeroSection() {
    const navigate = useNavigate();
    const handleUserLogin = () => { navigate(APP_ROUTES.USER_LOGIN); };
    const handleProviderLogin = () => { navigate(APP_ROUTES.AIPROVIDER_LOGIN); };
    const {t} = useTranslation();
    
    return (
        <Box component="section" sx={heroStyles.section}>
            <Container maxWidth="md" sx={heroStyles.container}>
                <Chip label={t("landingPage.heroSection.topChip")} size="small" variant="outlined" sx={heroStyles.topChip} />

                <Typography variant="h1" sx={heroStyles.title}>
                    <Trans i18nKey="landingPage.heroSection.mainTitle">
                        Você consegue distinguir<br /><em>humano de máquina?</em>
                    </Trans>
                </Typography>

                <Typography variant="body1" sx={heroStyles.subtitle}>
                    {t("landingPage.heroSection.subtitle")}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} sx={heroStyles.stackDisplay} spacing={2} >
                    <Button variant="contained" size="large" onClick={handleUserLogin} sx={heroStyles.userLoginBtn} >
                        {t("landingPage.heroSection.userLoginBtn")}
                    </Button>

                    <Button variant="outlined" size="large" onClick={handleProviderLogin} sx={heroStyles.registerModelBtn} >
                        {t("landingPage.heroSection.registerModelBtn")}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}
