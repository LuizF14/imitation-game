import { ThemeProvider, type Theme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";

import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import type { SidebarLink } from "../types/SidebarLinks";

interface Props {
    children: React.ReactNode;
    theme: Theme;             
    sidebarLinks: SidebarLink[];
    bottomPadding?: boolean;
}

export function ShellLayout({ children, theme, sidebarLinks, bottomPadding = true }: Props) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Navbar />

            <Box
                sx={{
                    display: "flex",
                    height: "calc(100vh - 65px)",
                    overflow: "hidden",
                }}
            >
                <Sidebar links={sidebarLinks} />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        pb: bottomPadding ? 8 : 0,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}