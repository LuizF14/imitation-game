import type { SxProps, Theme } from "@mui/material";

export const heroStyles: Record<string, SxProps<Theme>> = {
    section: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: `
            radial-gradient(ellipse 80% 60% at 50% 40%,
                rgba(186, 117, 23, 0.08) 0%,
                transparent 70%
            )
        `,
    },

    container: {
        position: "relative",
        textAlign: "center",
        py: 12,
    },

    topChip: {
        mb: 4,
        borderColor: "primary.dark",
        color: "primary.light",
        fontSize: "0.75rem",
        letterSpacing: "0.06em",
    },

    title: {
        fontSize: { xs: "2.6rem", sm: "3.8rem", md: "5rem" },
        lineHeight: 1.1,
        mb: 3,
        color: "text.primary",
        "& em": {
            fontStyle: "italic",
            color: "primary.light",
        },
    },

    subtitle: {
        fontSize: { xs: "1rem", md: "1.15rem" },
        color: "text.secondary",
        maxWidth: 600,
        mx: "auto",
        mb: 6,
        lineHeight: 1.7,
    },

    userLoginBtn: {
        px: 4,
        py: 1.5,
        fontSize: "0.95rem",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": { bgcolor: "primary.dark" },
        minWidth: 200,
    },

    registerModelBtn: {
        px: 4,
        py: 1.5,
        fontSize: "0.95rem",
        borderColor: "primary.dark",
        color: "primary.light",
        "&:hover": {
            borderColor: "primary.main",
            bgcolor: "rgba(186, 117, 23, 0.06)",
        },
        minWidth: 200,
    },

    stackDisplay: {
        justifyContent: "center",
        alignItems: "center"
    }
};