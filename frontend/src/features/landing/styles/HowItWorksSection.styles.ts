import type { SxProps, Theme } from "@mui/material";

export const howItWorksStyles: Record<string, SxProps<Theme>> = {
    section: {
        py: { xs: 10, md: 14 },
        backgroundColor: "background.paper",
        position: "relative",
        overflow: "visible", 
        "&::before": {
            content: '""',
            position: "absolute",
            top: -80, 
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to bottom, transparent, #0F1012)", 
            pointerEvents: "none",
        },
        "&::after": {
            content: '""',
            position: "absolute",
            bottom: -80,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to top, transparent, #0F1012)",
            pointerEvents: "none",
        },
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
    },

    stepsBox: {
        display: "grid",
        gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(5, 1fr)",
        },
        gap: { xs: 0, md: 2 },
        position: "relative",
    },

    stepBox: {
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
        alignItems: { xs: "flex-start", md: "center" },
        gap: { xs: 3, md: 2 },
        textAlign: { xs: "left", md: "center" },
        position: "relative",
    },

    iconStack: { 
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center"
    },

    mobileDecorativeLine: {
        display: { xs: "block", md: "none" },
        position: "absolute",
        left: 19,
        top: 44,
        width: "1px",
        bottom: 0,
        bgcolor: "divider",
    }, 

    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid",
        borderColor: "primary.dark",
        bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.light",
        mb: { xs: 0, md: 1 },
        position: "relative",
        zIndex: 1,
    },

    desktopConnectionLine: {
        display: { xs: "none", md: "block" },
        position: "absolute",
        top: 20,
        left: "calc(50% + 20px)",
        width: "calc(100% - 40px)",
        height: "1px",
        bgcolor: "divider",
    },

    stepNumber: {
        color: "primary.main",
        fontFamily: "monospace",
        letterSpacing: "0.06em",
        display: "block",
        mb: 0.5,
    },

    stepTitle: {
        color: "text.primary",
        fontWeight: 500,
        mb: 0.75,
        fontSize: "0.9rem",
    },

    stepDescription: {
        color: "text.secondary",
        lineHeight: 1.6,
        fontSize: "0.82rem",
    }
}   