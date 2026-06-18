import { Container } from "@mui/material";
import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { LeaderboardTabs } from "../../leaderboard/components/LeaderboardTabs";
import { aiProviderSidebarLinks } from "../data/AIProviderSidebarLinks";
import { tabs } from "../data/LeaderboardTabs";

export function AIProviderLeaderboardPage() {
    return (
        <ShellLayout theme={aiProviderTheme} sidebarLinks={aiProviderSidebarLinks}>
            <Container maxWidth="md" sx={{ py: 6, bgcolor: "background.default" }}>
                <LeaderboardTabs tabs={tabs} />
            </Container>
        </ShellLayout>
    );
}