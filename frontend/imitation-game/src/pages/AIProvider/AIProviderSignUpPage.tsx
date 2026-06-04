import { ThemeProvider } from "@emotion/react";
import { aiProviderTheme } from "../../theme/aiProviderTheme";
import { Navbar } from "../../components/Navbar";
import { Container, Paper } from "@mui/material";
import { AiProviderSignUpForm } from "../../components/AIProviderFields";

export function AIProviderSignUpPage() {
    async function handleSignUp(
        name: string,
        email: string,
        password: string
    ) {
        console.log({
            name,
            email,
            password
        });
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
                    <AiProviderSignUpForm onSubmit={handleSignUp} />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}