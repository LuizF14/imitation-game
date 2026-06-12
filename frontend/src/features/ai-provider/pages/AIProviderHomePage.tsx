import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { aiProviderSidebarLinks } from "./aiProviderSidebarLinks";
import { ModelsSection, type AIModel } from "../components/ModelsSection";
import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { Navbar } from "../../../shared/components/Navbar";
import { Sidebar } from "../../../shared/components/Sidebar";
import { aiProviderHomePageStyles } from "../styles/AIProviderHomePage.styles";

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
        <ThemeProvider theme={aiProviderTheme}>
            <CssBaseline />
            <Navbar />

            <Box sx={aiProviderHomePageStyles.container} >
                <Sidebar links={aiProviderSidebarLinks} />
                <Box component="main" sx={aiProviderHomePageStyles.mainContent} >
                    <ModelsSection models={mockModels} />
                </Box>
            </Box>
        </ThemeProvider>
    );
}