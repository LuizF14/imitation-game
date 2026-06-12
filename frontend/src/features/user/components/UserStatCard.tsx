import { Box, Typography } from "@mui/material";
import { userStatsStyles } from "../styles/UserStatsSection.styles";
import { useTranslation } from "react-i18next";

export interface UserStatCardProps {
    label: string;
    value: string | number;
    subtitle?: string;
}

export function UserStatCard({ label, value, subtitle }: UserStatCardProps) {
    const {t} = useTranslation();
    return (
        <Box sx={userStatsStyles.cardBox}>
            <Typography variant="caption" sx={userStatsStyles.cardLabel} >
                {t(label)}
            </Typography>

            <Typography variant="h4" sx={{ ...userStatsStyles.cardValue, mb: subtitle ? 0.75 : 0, }} >
                {value}
            </Typography>

            {subtitle && (
                <Typography variant="caption" sx={userStatsStyles.cardSubtitle} >
                    {t(subtitle)}
                </Typography>
            )}
        </Box>
    );
}