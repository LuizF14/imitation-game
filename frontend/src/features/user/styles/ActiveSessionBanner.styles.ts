import type { SxProps, Theme } from "@mui/material";

export const activeSessionStyles: Record<string, SxProps<Theme>> = {
    activeBox: {
        borderBottom: "0.5px solid",
        borderColor: "primary.dark",
        bgcolor: "rgba(var(--active-session-color, 29, 158, 117), 0.06)",
        py: 1.5,
    },

    finishedBox: {
        borderBottom: "0.5px solid",
        borderColor: "warning.dark",
        bgcolor: "rgba(var(--warning-session-color, 245, 158, 11), 0.06)",
        py: 1.5,
    }
}