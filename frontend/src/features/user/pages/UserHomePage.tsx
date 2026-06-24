import { userTheme } from "../../../app/themes/userTheme";
import { GameModesSection } from "../components/GameModeSection";
import { UserStatsSection } from "../components/UserStatsSection";
import { ActiveSessionBanner } from "../components/ActiveSessionBanner";
import { userSidebarLinks } from "../data/UserSideBarLinks";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { extractProfile } from "../utils/extractProfile";

export function UserHomePage() {
    const {data, isLoading, isError} = useCurrentUser();
    const profile = extractProfile(data, isLoading, isError);

    return (
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks} profile={profile} >
            <ActiveSessionBanner/>
            <UserStatsSection/>
            <GameModesSection/>
        </ShellLayout>
    );
}