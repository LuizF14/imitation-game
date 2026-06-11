import {Container, Paper} from "@mui/material";
import { LoginForm } from "../../auth/components/LoginForm";

import { ThemeProvider } from "@emotion/react";
import { mainTheme } from "../../../app/themes/mainTheme";
import { Navbar } from "../../../shared/components/Navbar";
import type { LoginFormData } from "../../auth/types/Login";

export function AdminLoginPage() {
    async function handleLogin(data: LoginFormData) {
        console.log(data);
    }

    return (
        <ThemeProvider theme={mainTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper elevation={3}
                    sx={{
                        mt: 8,
                        p: 4
                    }}
                >
                    <LoginForm onSubmit={handleLogin} role="ADMIN" showSignUp={false} />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}