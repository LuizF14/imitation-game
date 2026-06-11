import type { SxProps, Theme } from "@mui/material";

export const loginFormStyles: Record<string, SxProps<Theme>> = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%'
    },


    bottomText: { 
        mt: 1, 
        color: "text.secondary",
        fontWeight: 300 // Mantendo o peso leve que você escolheu para o corpo
    },

    link: {
        color: "primary.main",
        fontWeight: 500,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline",
        },
    }
}