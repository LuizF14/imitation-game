import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "./app/i18n";
import { mainTheme } from "./app/themes/mainTheme";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={mainTheme}>
    <CssBaseline />
    <RouterProvider router={router}/>
  </ThemeProvider>
);
