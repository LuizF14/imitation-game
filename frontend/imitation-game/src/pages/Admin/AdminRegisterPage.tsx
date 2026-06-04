import { ThemeProvider } from "@emotion/react";
import { Navbar } from "../../components/Navbar";
import { Container, Paper } from "@mui/material";
import { mainTheme } from "../../theme/mainTheme";
import { SignUpForm } from "../../components/SignUpForm";

export function AdminRegisterPage() {
    async function handleSignUp(
        name: string,
        email: string,
        password: string
    ) {
        console.log({
            name,
            email,
            password
        });
    }

    return (
        <ThemeProvider theme={mainTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        mt: 8,
                        p: 4
                    }}
                >
                    <SignUpForm role="ADMIN" onSubmit={handleSignUp} />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}