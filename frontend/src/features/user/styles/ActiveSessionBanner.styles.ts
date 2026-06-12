import type { SxProps, Theme } from "@mui/material";

export const activeSessionStyles: Record<string, SxProps<Theme>> = {
    box: {
        borderBottom: "0.5px solid",
        borderColor: "primary.dark",
        bgcolor: "rgba(var(--active-session-color, 29, 158, 117), 0.06)",
        py: 1.5,
    }
}