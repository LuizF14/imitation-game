import { ThemeProvider } from "@emotion/react";
import { userTheme } from "../../../app/themes/userTheme";
import { Navbar } from "../../../shared/components/Navbar";
import { Box, CssBaseline } from "@mui/material";
import { GameModesSection } from "../components/GameModeSection";
import { UserStatsSection } from "../components/UserStatsSection";
import { ActiveSessionBanner } from "../components/ActiveSessionBanner";
import { Sidebar } from "../../../shared/components/Sidebar";
import { userSidebarLinks } from "../data/UserSideBarLinks";
import { userHomePageStyles } from "../styles/UserHomePage.styles";

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

            <Box sx={userHomePageStyles.container}>
                <Sidebar links={userSidebarLinks} />
                <Box component="main" sx={userHomePageStyles.mainContent}>
                    <ActiveSessionBanner sessionId={mockActiveSession.sessionId} 
                        mode={mockActiveSession.mode} secondsLeft={mockActiveSession.secondsLeft} />
                    <UserStatsSection stats={mockStats}/>
                    <GameModesSection/>
                </Box>
            </Box>
        </ThemeProvider>
    );
}