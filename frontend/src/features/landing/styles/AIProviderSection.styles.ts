import type { SxProps, Theme } from "@mui/material";

export const aiProviderSectionStyles: Record<string, SxProps<Theme>> = {
    section: {
        py: { xs: 10, md: 14 },
        position: "relative",
        background: `
            radial-gradient(ellipse 60% 60% at 20% 50%,
                rgba(186, 117, 23, 0.06) 0%,
                transparent 70%
            )
        `,
    },

    suptitle: {
        color: "primary.main",
        letterSpacing: "0.12em",
        fontSize: "0.72rem",
        display: "block",
        mb: 1.5,
    },

    title: {
        fontSize: { xs: "1.8rem", md: "2.4rem" },
        color: "text.primary",
        mb: 2,
    },

    subtitle: {
        color: "text.secondary",
        mb: 5,
        lineHeight: 1.7,
        fontSize: "0.95rem",
    },

    boxIcon: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "1px solid",
        borderColor: "primary.dark",
        bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.light",
        flexShrink: 0,
    },

    stepNumber: {
        color: "primary.main",
        fontFamily: "monospace",
        letterSpacing: "0.06em",
    },

    stepTitle: { 
        color: "text.primary", 
        fontWeight: 500
    },

    stepDescription: { 
        color: "text.secondary", 
        lineHeight: 1.6 
    },

    registerModelBtn: {
        px: 4,
        py: 1.5,
        fontSize: "0.95rem",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": { bgcolor: "primary.dark" },
    },

    featureBox: {
        p: 3,
        height: "100%",
        bgcolor: "background.paper",
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 2,
        transition: "border-color 0.2s",
        "&:hover": {
            borderColor: "primary.dark",
        },
    },

    featureIcon: {
        width: 36,
        height: 36,
        borderRadius: 1.5,
        bgcolor: "rgba(186, 117, 23, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.light",
        mb: 2,
    },

    featureTitle: { 
        color: "text.primary", 
        fontWeight: 500, 
        mb: 0.75
    },

    featureDescription: { 
        color: "text.secondary", 
        lineHeight: 1.6, 
        fontSize: "0.82rem" 
    }

}