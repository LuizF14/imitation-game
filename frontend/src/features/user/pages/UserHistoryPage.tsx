import { userTheme } from "../../../app/themes/userTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { userSidebarLinks } from "../data/UserSideBarLinks";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { extractProfile } from "../utils/extractProfile";

export function UserHistoryPage() {
    const {data, isLoading} = useCurrentUser();
    const profile = extractProfile(data, isLoading);
    
    return (
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks} profile={profile}>
            history
        </ShellLayout>
    );
}