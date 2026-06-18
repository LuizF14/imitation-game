import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { aiProviderSidebarLinks } from "../data/AIProviderSidebarLinks";

export function AIProviderSettingsPage() {
    return (
        <ShellLayout theme={aiProviderTheme} sidebarLinks={aiProviderSidebarLinks}>
            AIProviderSettingsPage
        </ShellLayout>
    );
}