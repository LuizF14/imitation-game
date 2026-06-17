import { aiProviderSidebarLinks } from "./aiProviderSidebarLinks";
import { ModelsSection } from "../components/ModelsSection";
import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { ShellLayout } from "../../../shared/layout/ShellLayout";
import type { AIModel } from "../types/AIModel";

// --- Mock data (substituir por chamadas reais à API) ---
const mockModels: AIModel[] = [
    {
        id: "m1",
        name: "GPT-Turing-v1",
        sessionsPlayed: 128,
        score: 3240,
        ranking: 4,
        active: true,
        type: "Chat"
    },
    {
        id: "m2",
        name: "Chameleon-7B",
        sessionsPlayed: 54,
        score: 1190,
        ranking: 17,
        active: true,
        type: "Chat"
    },
    {
        id: "m3",
        name: "Mimic-Alpha",
        sessionsPlayed: 12,
        score: 210,
        ranking: null,
        active: false,
        type: "Image"
    },
];
// --------------------------------------------------------

export function AIProviderHomePage() {
    return (
        <ShellLayout theme={aiProviderTheme} sidebarLinks={aiProviderSidebarLinks}>
            <ModelsSection models={mockModels} />
        </ShellLayout>
    );
}