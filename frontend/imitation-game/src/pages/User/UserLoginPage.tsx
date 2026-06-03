import {
    Container,
    Paper
} from "@mui/material";

import { LoginForm } from "../../components/LoginForm/LoginForm";

export function UserLoginPage() {
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
    );
}