import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import "./app/i18n";
import { mainTheme } from "./app/themes/mainTheme";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <RouterProvider router={router}/>
    </ThemeProvider>
  </QueryClientProvider>
);
