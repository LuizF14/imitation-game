import type { SxProps, Theme } from "@mui/material";

export const chatTimerBannerStyles: Record<string, SxProps<Theme>> = {
    container: {
        px: 3,
        py: 1.25,
        borderBottom: "0.5px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
    },

    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        bgcolor: "background.paper",
        border: "0.5px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.disabled",
    },

    counterChip: { 
        fontFamily: "monospace",
        fontWeight: 600,
        fontSize: "0.82rem",
        border: "0.5px solid"
    }
}   