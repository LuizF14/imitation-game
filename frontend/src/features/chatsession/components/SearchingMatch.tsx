import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface SearchingMatchProps {
    onCancel: () => void;
}

export function SearchingMatch({ onCancel }: SearchingMatchProps) {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100%",
                gap: 4,
            }}
        >
            <Stack sx={{alignItems: "center"}} spacing={3}>
                <CircularProgress size={56} thickness={3} />

                <Stack sx={{alignItems: "center"}} spacing={1}>
                    <Typography variant="h6" sx={{fontWeight: 600}}>
                        {t("searchingMatch.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t("searchingMatch.subtitle")}
                    </Typography>
                </Stack>

                <Button variant="outlined" color="inherit" size="small" onClick={onCancel}>
                    {t("searchingMatch.cancel")}
                </Button>
            </Stack>
        </Box>
    );
}