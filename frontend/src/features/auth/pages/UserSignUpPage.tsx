import { ThemeProvider } from "@emotion/react";
import { userTheme } from "../../../app/themes/userTheme";
import { Navbar } from "../../../shared/components/Navbar";
import { Container, Paper } from "@mui/material";
import { UserSignUpForm } from "../components/UserSignUpForm";
import type { UserSignUpData } from "../types/UserSignUpData";
import { UserAuthAPI } from "../api/userAuth.api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "../../../app/router/appRoutes";

export function UserSignUpPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    async function handleSignUp(data: UserSignUpData) {
        try {
            setLoading(true);
            setError(undefined);

            const payload = {
                username: data.name,
                email: data.email,
                password: data.password,
            };

            await UserAuthAPI.signup(payload);
            navigate(APP_ROUTES.USER_LOGIN);
        } catch (err: any) {
            setError(err.response?.data?.error ?? "Erro ao criar conta");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ThemeProvider theme={userTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
                    <UserSignUpForm onSubmit={handleSignUp} loading={loading} error={error}/>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}