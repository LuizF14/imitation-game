import type { SxProps, Theme } from "@mui/material";

export const modelCardStyles: Record<string, SxProps<Theme>> = {
    mainContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "primary.dark" },
    },

    cardContent: { flex: 1, p: 3 },

    modelStatus: { fontSize: "0.68rem", height: 20 },

    metricSuptitle: { color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 },

    metricStatus: { fontSize: "1.4rem", color: "text.primary", lineHeight: 1 },

    viewDetailedMetricsBtn: {
        borderColor: "primary.dark",
        color: "primary.light",
        fontSize: "0.82rem",
        "&:hover": {
            borderColor: "primary.main",
            bgcolor: "rgba(186, 117, 23, 0.06)",
        },
    }
}