import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import { Card, Typography } from "@mui/material";
import { emptyModelStateStyles } from "../styles/EmptyModelState.styles";
import { useTranslation } from "react-i18next";

export function EmptyModelState() {
    const {t} = useTranslation();
    return (
        <Card sx={emptyModelStateStyles.container} >
            <SmartToyOutlinedIcon sx={{ fontSize: 36, color: "text.disabled", mb: 1.5 }} />
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
                {t("aiprovider.modelsSection.emptyModelState")}
            </Typography>
        </Card>
    );
}