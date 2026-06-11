import { ThemeProvider } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { aiProviderTheme } from "../../theme/aiProviderTheme";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { aiProviderSidebarLinks } from "./aiProviderSidebarLinks";
import { ModelsSection } from "../../components/ModelsSection";
import type { AIModel } from "../../components/ModelsSection";

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

            {/* Topo */}
            <Navbar />

            {/* Corpo: sidebar + conteúdo */}
            <Box
                sx={{
                    display: "flex",
                    height: "calc(100vh - 64px)",
                    overflow: "hidden",
                }}
            >
                <Sidebar links={aiProviderSidebarLinks} />

                {/* Conteúdo principal com scroll */}
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        pb: 8,
                    }}
                >
                    <ModelsSection models={mockModels} />
                </Box>
            </Box>
        </ThemeProvider>
    );
}