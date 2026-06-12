import type { SxProps, Theme } from "@mui/material";

export const userStatsStyles: Record<string, SxProps<Theme>> = {
    title: {
        color: "primary.main",
        letterSpacing: "0.1em",
        fontSize: "0.72rem",
    },

    cardBox: {
        p: 2.5,
        bgcolor: "background.paper",
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
    },

    cardLabel: {
        color: "text.secondary",
        fontSize: "0.75rem",
        display: "block",
        mb: 1,
    },

    cardValue: {
        fontSize: { xs: "1.4rem", md: "1.8rem" },
        color: "text.primary",
        lineHeight: 1,
    },

    cardSubtitle: { color: "text.disabled", fontSize: "0.7rem" },
    
}