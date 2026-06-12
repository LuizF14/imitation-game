import type { SxProps, Theme } from "@mui/material";

export const modelsSectionStyles: Record<string, SxProps<Theme>> = {
    section: { py: { xs: 4, md: 6 } },

    mainStack: { 
        mb: 3,
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between"
    },

    title: {
        color: "primary.main",
        letterSpacing: "0.1em",
        fontSize: "0.72rem",
    },

    registerNewModelBtn: {
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": { bgcolor: "primary.dark" },
        fontSize: "0.8rem",
    }

}