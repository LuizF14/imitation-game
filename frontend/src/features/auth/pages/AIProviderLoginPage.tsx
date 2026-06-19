import {Container, Paper} from "@mui/material";
import { LoginForm } from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { Navbar } from "../../../shared/components/Navbar";
import type { LoginFormData } from "../types/Login";
import { APP_ROUTES } from "../../../app/router/appRoutes";
import { useState } from "react";
import { AIProviderAuthAPI } from "../api/aiproviderAuth.api";

export function AIProviderLoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    async function handleLogin(data: LoginFormData) {
        try {
            setLoading(true);
            setError(undefined);

            const response = await AIProviderAuthAPI.login(data);

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            navigate(APP_ROUTES.AIPROVIDER_HOME_PAGE);
        } catch (err: any) {
            setError(err.response?.data?.error ?? "Erro ao logar");
        } finally {
            setLoading(false);
        }
    }

    function handleNavigationToRegister() {
        navigate(APP_ROUTES.AIPROVIDER_SIGNUP);
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
                        loading={loading}
                        error={error}
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}