import { useParams } from "react-router-dom";
import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import { aiProviderSidebarLinks } from "../../ai-provider/data/AIProviderSidebarLinks";

export function AIProviderDetailedModelPage() {
    const {id} = useParams();

    return (
        <ShellLayout theme={aiProviderTheme} sidebarLinks={aiProviderSidebarLinks}>
            AIProviderDetailedModelPage{id}
        </ShellLayout>
    );
}