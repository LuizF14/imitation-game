import { ThemeProvider, type Theme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";

import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import type { SidebarLink } from "../types/SidebarLinks";
import type { Profile } from "../types/Profile";

interface Props {
    children: React.ReactNode;
    theme: Theme;             
    sidebarLinks: SidebarLink[];
    bottomPadding?: boolean;
    profile: Profile;
}

export function ShellLayout({ children, theme, sidebarLinks, bottomPadding = true, profile}: Props) {
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
                <Sidebar links={sidebarLinks} profile={profile} />

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