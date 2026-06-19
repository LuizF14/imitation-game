import { ThemeProvider } from "@emotion/react";
import { aiProviderTheme } from "../../../app/themes/aiProviderTheme";
import { Navbar } from "../../../shared/components/Navbar";
import { Container, Paper } from "@mui/material";
import { AIProviderSignUpForm } from "../components/AIProviderSignUpForm";
import type { AIProviderSignUpData } from "../types/AIProviderSignUpData";
import { AIProviderAuthAPI } from "../api/aiproviderAuth.api";
import { APP_ROUTES } from "../../../app/router/appRoutes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function AIProviderSignUpPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    async function handleSignUp(data: AIProviderSignUpData) {
        try {
            setLoading(true);
            setError(undefined);

            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                baseURL: data.baseURL
            };

            await AIProviderAuthAPI.signup(payload);
            navigate(APP_ROUTES.AIPROVIDER_LOGIN);
        } catch (err: any) {
            setError(err.response?.data?.error ?? "Erro ao criar conta");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ThemeProvider theme={aiProviderTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ mt: 8, p: 4 }} >
                    <AIProviderSignUpForm onSubmit={handleSignUp} loading={loading} error={error}/>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}