import { Container, Paper } from "@mui/material";
import { LoginForm } from "../../auth/components/LoginForm";

import { ThemeProvider } from "@emotion/react";
import { userTheme } from "../../../app/themes/userTheme";
import { Navbar } from "../../../shared/components/Navbar";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../app/router/appRoutes";
import type { LoginFormData } from "../../auth/types/Login";

export function UserLoginPage() {
    const navigate = useNavigate();

    async function handleLogin(loginData: LoginFormData) {
        console.log(loginData);
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
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}