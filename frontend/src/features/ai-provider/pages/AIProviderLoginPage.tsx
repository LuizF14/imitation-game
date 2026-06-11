import {Container, Paper} from "@mui/material";
import { LoginForm } from "../../auth/components/LoginForm";
import { useNavigate } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { Navbar } from "../../../shared/components/Navbar";
import type { LoginFormData } from "../../auth/types/Login";
import { APP_ROUTES } from "../../../app/router/appRoutes";

export function AIProviderLoginPage() {
    const navigate = useNavigate();

    async function handleLogin(data: LoginFormData) {
        console.log(data);
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
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}