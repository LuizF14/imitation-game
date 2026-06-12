import type { SxProps, Theme } from "@mui/material";

export const registerModelFormStyles: Record<string, SxProps<Theme>> = {
    submitBtn: {
        mt: 1,
        py: 1.25,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": { bgcolor: "primary.dark" },
    }
}
