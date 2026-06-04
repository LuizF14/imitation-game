import {Container, Paper} from "@mui/material";
import { LoginForm } from "../../components/LoginForm/LoginForm";

import { ThemeProvider } from "@emotion/react";
import { aiProviderTheme } from "../../theme/aiProviderTheme";

export function AIProviderLoginPage() {
    async function handleLogin(
        email: string,
        password: string,
        rememberMe: boolean
    ) {
        console.log({
            email,
            password,
            rememberMe
        });
    }

    return (
        <ThemeProvider theme={aiProviderTheme}>
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        mt: 8,
                        p: 4
                    }}
                >
                    <LoginForm
                        onSubmit={handleLogin}
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}