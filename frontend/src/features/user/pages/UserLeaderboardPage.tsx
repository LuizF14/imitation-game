import { Container } from "@mui/material";
import { userTheme } from "../../../app/themes/userTheme";
import { userSidebarLinks } from "../data/UserSideBarLinks";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { LeaderboardTabs } from "../../leaderboard/components/LeaderboardTabs";
import { tabs } from "../data/LeaderboardTabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { extractProfile } from "../utils/extractProfile";

export function UserLeaderboardPage() {
    const {data, isLoading} = useCurrentUser();
    const profile = extractProfile(data, isLoading);

    return (
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks} profile={profile}>
            <Container maxWidth="md" sx={{ py: 6, bgcolor: "background.default" }}>
                <LeaderboardTabs tabs={tabs} />
            </Container>
        </ShellLayout>
    );
}