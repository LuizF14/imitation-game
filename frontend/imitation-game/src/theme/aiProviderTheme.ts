import { createTheme } from "@mui/material";
import { baseTheme } from "./baseTheme";

const coral = {
  50:  "#FAECE7",
  200: "#F0997B",
  400: "#D85A30",
  600: "#993C1D",
  800: "#712B13",
  900: "#4A1B0C",
};

export const aiProviderTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      light:        coral[200],
      main:         coral[400],
      dark:         coral[600],
      contrastText: coral[50],
    },
    secondary: {
      main:         coral[800],
      contrastText: coral[200],
    },
  },
});