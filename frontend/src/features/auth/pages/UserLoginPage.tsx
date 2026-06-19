import { Container, Paper } from "@mui/material";
import { LoginForm } from "../components/LoginForm";

import { ThemeProvider } from "@emotion/react";
import { userTheme } from "../../../app/themes/userTheme";
import { Navbar } from "../../../shared/components/Navbar";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../app/router/appRoutes";
import type { LoginFormData } from "../types/Login";
import { useState } from "react";
import { UserAuthAPI } from "../api/userAuth.api";

export function UserLoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    async function handleLogin(loginData: LoginFormData) {
        try {
            setLoading(true);
            setError(undefined);

            const response = await UserAuthAPI.login(loginData);

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            navigate(APP_ROUTES.USER_HOME_PAGE);
        } catch (err: any) {
            setError(err.response?.data?.error ?? "Erro ao logar");
        } finally {
            setLoading(false);
        }
    }

    async function handleNavigateToRegister() {
        navigate(APP_ROUTES.USER_SIGNUP);
    }

    return (
        <ThemeProvider theme={userTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ mt: 8, p: 4 }} >
                    <LoginForm
                        onSubmit={handleLogin}
                        onNavigateToRegister={handleNavigateToRegister}
                        role="USER"
                        loading={loading}
                        error={error}
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}