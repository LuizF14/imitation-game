import { ThemeProvider } from "@emotion/react";
import { userTheme } from "../../theme/userTheme";
import { Navbar } from "../../components/Navbar";
import { Box, CssBaseline } from "@mui/material";
import { GameModesSection } from "../../components/GameModeSection";
import { UserStatsSection } from "../../components/UserStatsSection";
import { ActiveSessionBanner } from "../../components/ActiveSessionBanner";
import { Sidebar } from "../../components/Sidebar";
import { userSidebarLinks } from "./UserSideBarLinks";

const mockStats = {
    sessionsPlayed: 42,
    winRate: 61.9,
    avgTuringRate: 0.73,
    ranking: 18,
};

const mockActiveSession = {
    sessionId: "abc-123",
    mode: "chat" as const,
    secondsLeft: 187,
};

export function UserHomePage() {
    return (
        <ThemeProvider theme={userTheme}>
            <CssBaseline />
            <Navbar></Navbar>

            <Box sx={{
                display: "flex",
                height: "calc(100vh - 65px)", // desconta a Navbar
                overflow: "hidden",
            }}>
                <Sidebar links={userSidebarLinks}></Sidebar>
                <Box component="main"
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        pb: 8,
                    }}>
                    <ActiveSessionBanner sessionId={mockActiveSession.sessionId}
                    mode={mockActiveSession.mode}
                    secondsLeft={mockActiveSession.secondsLeft}
                    ></ActiveSessionBanner>
                    <UserStatsSection stats={mockStats}/>
                    <GameModesSection/>
                </Box>
            </Box>
        </ThemeProvider>
    );
}