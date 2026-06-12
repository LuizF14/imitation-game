import type { SxProps, Theme } from "@mui/material";

export const registerModelStyles: Record<string, SxProps<Theme>> = {
    headerBox: {
        width: 32,
        height: 32,
        borderRadius: 1.5,
        bgcolor: "rgba(186, 117, 23, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.light",
    }
}