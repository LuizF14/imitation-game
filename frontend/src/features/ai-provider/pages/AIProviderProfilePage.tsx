import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { aiProviderSidebarLinks } from "../data/AIProviderSidebarLinks";

export function AIProviderProfilePage() {
    return (
        <ShellLayout theme={aiProviderTheme} sidebarLinks={aiProviderSidebarLinks}>
            AIProviderProfilePage
        </ShellLayout>
    );
}