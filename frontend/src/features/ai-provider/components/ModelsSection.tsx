import { Box, Button, Container, Grid, Stack, Typography, } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useState } from "react";
import { RegisterModelModal } from "./RegisterModelModal";
import type { AIModel } from "../types/AIModel";
import { ModelCard } from "./ModelCard";
import { EmptyModelState } from "./EmptyModelState";
import { modelsSectionStyles } from "../styles/ModelsSection.styles";
import { useTranslation } from "react-i18next";

interface Props {
    models: AIModel[];
}

export function ModelsSection({ models }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const {t} = useTranslation();

    return (
        <Box component="section" sx={modelsSectionStyles.section}>
            <Container maxWidth="lg">
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={modelsSectionStyles.mainStack} >
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={1}>
                        <SmartToyOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        <Typography variant="overline" sx={modelsSectionStyles.title} >
                            {t("aiprovider.modelsSection.title")}
                        </Typography>
                    </Stack>

                    <Button variant="contained" size="small" startIcon={<AddOutlinedIcon />} onClick={() => setModalOpen(true)} sx={modelsSectionStyles.registerNewModelBtn} >
                        {t("aiprovider.modelsSection.registerNewModelBtn")}
                    </Button>
                </Stack>

                {models.length === 0 ? (<EmptyModelState />) : (
                    <Grid container spacing={3}>
                        {models.map((model) => (
                            <ModelCard model={model}/>
                        ))}
                    </Grid>
                )}
            </Container>

            <RegisterModelModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </Box>
    );
}