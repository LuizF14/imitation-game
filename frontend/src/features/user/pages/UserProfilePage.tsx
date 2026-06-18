import { userTheme } from "../../../app/themes/userTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { userSidebarLinks } from "../data/UserSideBarLinks";

export function UserProfilePage() {
    return (
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks}>
            ddd
        </ShellLayout>
    );
}