import { userTheme } from "../../../app/themes/userTheme";
import { GameModesSection } from "../components/GameModeSection";
import { UserStatsSection } from "../components/UserStatsSection";
import { ActiveSessionBanner } from "../components/ActiveSessionBanner";
import { userSidebarLinks } from "../data/UserSideBarLinks";
import { ShellLayout } from "../../../shared/layout/ShellLayout";

const mockStats = {
    sessionsPlayed: 42,
    score: 1010,
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
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks}>
            <ActiveSessionBanner sessionId={mockActiveSession.sessionId} 
                mode={mockActiveSession.mode} secondsLeft={mockActiveSession.secondsLeft} />
            <UserStatsSection stats={mockStats}/>
            <GameModesSection/>
        </ShellLayout>
    );
}