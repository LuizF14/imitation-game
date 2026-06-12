import type { SxProps, Theme } from "@mui/material";

export const gamemodeSectionStyles: Record<string, SxProps<Theme>> = {
    title: {
        color: "primary.main",
        letterSpacing: "0.1em",
        fontSize: "0.72rem",
    },

    modeTitle: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "border-color 0.2s",
    },

    modeIcon: {
        width: 56,
        height: 56,
        borderRadius: 2,
        bgcolor: "rgba(186, 117, 23, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.light",
        mb: 2.5,
    },

    modeContent: { flex: 1, p: 3 },

    modeDescription: { color: "text.secondary", mb: 1.5, fontWeight: 400 },

    modeLabel: { fontSize: "1.1rem" },

    modeNotAvailable: { fontSize: "0.68rem", height: 18 },

    modeDetail: {
        color: "text.disabled",
        fontSize: "0.8rem",
        lineHeight: 1.6,
    },

    startSession: {
        borderColor: "primary.dark",
        color: "primary.light",
        "&:hover": {
            borderColor: "primary.main",
            bgcolor: "rgba(186, 117, 23, 0.06)",
        },
    },

    emptySlot: {
        height: "100%",
        minHeight: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "dashed",
        opacity: 0.4,
        cursor: "default",
    },

    emptySlotText: { color: "text.disabled", fontSize: "0.8rem" }
}
