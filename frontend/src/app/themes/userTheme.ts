import { createTheme } from "@mui/material";
import { baseTheme } from "./baseTheme";

const teal = {
  50:  "#E1F5EE",
  200: "#5DCAA5",
  400: "#1D9E75",
  600: "#0F6E56",
  800: "#085041",
  900: "#04342C",
};

export const userTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      light:        teal[200],
      main:         teal[400],
      dark:         teal[600],
      contrastText: teal[50],
    },
    secondary: {
      main:         teal[800],
      contrastText: teal[200],
    },
  },
});