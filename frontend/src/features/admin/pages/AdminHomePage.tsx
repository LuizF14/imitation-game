import { mainTheme } from "../../../app/themes/mainTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { adminSidebarLinks } from "../data/AdminSidebarLinks";

export function AdminHomePage() {

    return (
        <ShellLayout theme={mainTheme} sidebarLinks={adminSidebarLinks}>
            AdminHomePage
        </ShellLayout>
    );
}