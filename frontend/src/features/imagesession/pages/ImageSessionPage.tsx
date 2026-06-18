import { userTheme } from "../../../app/themes/userTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { userSidebarLinks } from "../../user/data/UserSideBarLinks";

export function ImageSessionPage() {
    return (
        <ShellLayout theme={userTheme} sidebarLinks={userSidebarLinks}>
            ImageSessionPage
        </ShellLayout>
    );
}