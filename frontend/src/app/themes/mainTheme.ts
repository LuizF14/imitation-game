import { createTheme } from "@mui/material/styles";
import { baseTheme } from "./baseTheme";

const amber = {
  50:  "#FAEEDA",
  200: "#EF9F27",
  400: "#BA7517",
  600: "#854F0B",
  800: "#633806",
  900: "#412402",
};

export const mainTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      light:        amber[200],
      main:         amber[400],
      dark:         amber[600],
      contrastText: amber[50],
    },
    secondary: {
      main:         amber[800],
      contrastText: amber[200],
    },
  },
});