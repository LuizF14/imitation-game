import type { SxProps, Theme } from "@mui/material";

export const messageBubbleStyles: Record<string, SxProps<Theme>> = {
    containerMe: { display: "flex", justifyContent: "flex-end"},
    containerOpp: { display: "flex", justifyContent: "flex-start"},

    mainStack: { alignItems: "flex-end", maxWidth: { xs: "85%", md: "60%" } },

    avatarMe: {
        width: 24,
        height: 24,
        border: "0.5px solid",
        borderColor: "divider",
        flexShrink: 0,
        bgcolor: "primary.dark"
    },

    avatarOpp: {
        width: 24,
        height: 24,
        border: "0.5px solid",
        borderColor: "divider",
        flexShrink: 0,
        bgcolor: "background.paper"
    },

    bubbleBoxMe: {
        px: 2,
        py: 1.25,
        borderRadius: "12px 12px 2px 12px",
        bgcolor: "primary.dark",
        border: "0.5px solid",
        borderColor: "primary.dark",
    },

    bubbleBoxOpp: {
        px: 2,
        py: 1.25,
        borderRadius: "12px 12px 12px 2px",
        bgcolor: "background.paper",
        border: "0.5px solid",
        borderColor: "divider",
    },

    textMe: {
        color: "primary.contrastText",
        lineHeight: 1.5,
        fontSize: "0.875rem",
    },

    textOpp: {
        color: "text.primary",
        lineHeight: 1.5,
        fontSize: "0.875rem",
    },

    timestampMe: {
        color: "text.disabled",
        fontSize: "0.68rem",
        display: "block",
        mt: 0.5,
        textAlign: "right",
    },

    timestampOpp: {
        color: "text.disabled",
        fontSize: "0.68rem",
        display: "block",
        mt: 0.5,
        textAlign: "left",
    }
}