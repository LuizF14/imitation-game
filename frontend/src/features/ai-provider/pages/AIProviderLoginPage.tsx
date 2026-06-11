import {Container, Paper} from "@mui/material";
import { LoginForm } from "../../components/LoginForm";
import { useNavigate } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { aiProviderTheme } from "../../theme/aiProviderTheme";
import { Navbar } from "../../components/Navbar";

export function AIProviderLoginPage() {
    const navigate = useNavigate();

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

    function handleNavigationToRegister() {
        navigate("/aiprovider/signup");
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
                    <LoginForm
                        onSubmit={handleLogin}
                        role="AIPROVIDER"
                        onNavigateToRegister={handleNavigationToRegister}
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}