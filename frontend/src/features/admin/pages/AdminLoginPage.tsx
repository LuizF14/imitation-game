import {Container, Paper} from "@mui/material";
import { LoginForm } from "../../../../src/components/LoginForm";

import { ThemeProvider } from "@emotion/react";
import { mainTheme } from "../../../app/themes/mainTheme";
import { Navbar } from "../../../../src/components/Navbar";

export function AdminLoginPage() {
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
        <ThemeProvider theme={mainTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper elevation={3}
                    sx={{
                        mt: 8,
                        p: 4
                    }}
                >
                    <LoginForm
                        onSubmit={handleLogin}
                        role="ADMIN"
                        showSignUp={false}
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}