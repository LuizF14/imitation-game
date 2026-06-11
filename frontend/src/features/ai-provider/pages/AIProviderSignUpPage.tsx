import { ThemeProvider } from "@emotion/react";
import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { Navbar } from "../../../shared/components/Navbar";
import { Container, Paper } from "@mui/material";
import { AIProviderSignUpForm } from "../../auth/components/AIProviderSignUpForm";
import type { AIProviderSignUpData } from "../../auth/types/AIProviderSignUpData";

export function AIProviderSignUpPage() {
    async function handleSignUp(data: AIProviderSignUpData) {
        console.log(data);
    }

    return (
        <ThemeProvider theme={aiProviderTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        mt: 8,
                        p: 4
                    }}
                >
                    <AIProviderSignUpForm onSubmit={handleSignUp} />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}