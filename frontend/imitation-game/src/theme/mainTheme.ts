import { createTheme } from "@mui/material/styles";

export const mainTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#4ad219"
        },
        secondary: {
            main: "#9c27b0"
        },
        background: {
            default: "#121212",
            paper: "#1E1E1E"
        }
    }
});