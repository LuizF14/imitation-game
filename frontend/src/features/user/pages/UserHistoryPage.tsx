import { userTheme } from "../../../app/themes/userTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { userSidebarLinks } from "../data/UserSideBarLinks";

export function UserHistoryPage() {
    return (
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks}>
            history
        </ShellLayout>
    );
}