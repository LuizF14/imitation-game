import type { SxProps, Theme } from "@mui/material";

export const apiKeyReceivedStyles: Record<string, SxProps<Theme>> = {
    apiKeyBox: {
        p: 2,
        bgcolor: "rgba(186, 117, 23, 0.05)",
        border: "0.5px solid",
        borderColor: "primary.dark",
        borderRadius: 1.5,
    },

    apiKeyTitle: { color: "primary.main", display: "block", mb: 1, fontSize: "0.72rem", letterSpacing: "0.06em" },

    apiKeyText: {
        fontFamily: "monospace",
        color: "text.primary",
        wordBreak: "break-all",
        fontSize: "0.85rem",
    },

    warning: {
        p: 2,
        bgcolor: "rgba(255, 255, 255, 0.02)",
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 1.5,
    },

    close: {
        py: 1.25,
        borderColor: "primary.dark",
        color: "primary.light",
        "&:hover": {
            borderColor: "primary.main",
            bgcolor: "rgba(186, 117, 23, 0.06)",
        },
    }
}