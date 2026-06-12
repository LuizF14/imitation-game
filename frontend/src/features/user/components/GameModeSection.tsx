import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";

import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

import { useNavigate } from "react-router-dom";
import { gamemodeSectionStyles } from "../styles/GameModeSection.styles";
import { useTranslation } from "react-i18next";
import { gameModes } from "../data/Gamemodes";

export function GameModesSection() {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <Box component="section" sx={{ py: { xs: 4, md: 1 } }}>
            <Container maxWidth="lg">

                <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
                    <BoltOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                    <Typography variant="overline" sx={gamemodeSectionStyles.title} >
                        {t("user.gamemodeSection.title")}
                    </Typography>
                </Stack>

                <Grid container spacing={3}>
                    {gameModes.map((mode) => (
                        <Grid size={{xs: 12, sm: 6, md: 4}}  key={mode.key}>
                            <Card sx={{...gamemodeSectionStyles.modeTitle, cursor: mode.available ? "default" : "not-allowed", opacity: mode.available ? 1 : 0.5, "&:hover": mode.available ? { borderColor: "primary.dark" }: {},}} >
                                <CardContent sx={gamemodeSectionStyles.modeContent}>
                                    <Box sx={gamemodeSectionStyles.modeIcon} >
                                        {mode.icon}
                                    </Box>

                                    <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
                                        <Typography variant="h5" sx={gamemodeSectionStyles.modeLabel}>
                                            {t(mode.label)}
                                        </Typography>
                                        {!mode.available && ( <Chip label="Soon" size="small" sx={gamemodeSectionStyles.modeNotAvailable} /> )}
                                    </Stack>

                                    <Typography variant="body2" sx={gamemodeSectionStyles.modeDescription} >
                                        {t(mode.description)}
                                    </Typography>

                                    <Typography variant="body2" sx={gamemodeSectionStyles.modeDetail} >
                                        {t(mode.detail)}
                                    </Typography>
                                </CardContent>

                                <Box sx={{ px: 3, pb: 3 }}>
                                    <Button variant="outlined" fullWidth disabled={!mode.available} onClick={() => navigate(mode.route)} sx={gamemodeSectionStyles.startSession} >
                                        {t("user.gamemodeSection.startSession")}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}

                    <Grid size={{xs: 12, sm: 6, md: 4}}>
                        <Card sx={gamemodeSectionStyles.emptySlot} >
                            <Typography variant="body2" sx={gamemodeSectionStyles.emptySlotText} >
                                {t("user.gamemodeSection.moreModesComing")}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}