import { Container } from "@mui/material";
import { userTheme } from "../../../app/themes/userTheme";
import { userSidebarLinks } from "../data/UserSideBarLinks";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { LeaderboardTabs } from "../../leaderboard/components/LeaderboardTabs";
import { tabs } from "../data/LeaderboardTabs";

export function UserLeaderboardPage() {
    return (
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks}>
            <Container maxWidth="md" sx={{ py: 6, bgcolor: "background.default" }}>
                <LeaderboardTabs tabs={tabs} />
            </Container>
        </ShellLayout>
    );
}