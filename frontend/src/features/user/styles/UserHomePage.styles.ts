import type { SxProps, Theme } from "@mui/material";

export const userHomePageStyles: Record<string, SxProps<Theme>> = {
    container: {
        display: "flex",
        height: "calc(100vh - 65px)", 
        overflow: "hidden",
    },

    mainContent: {
            flex: 1,
            overflowY: "auto",
            pb: 8,
    }
}