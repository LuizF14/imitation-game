import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./i18n";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { mainTheme } from "./theme/mainTheme";

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={mainTheme}>
    <CssBaseline />
    <RouterProvider router={router}/>
  </ThemeProvider>
);
