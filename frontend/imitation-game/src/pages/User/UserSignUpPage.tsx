import { ThemeProvider } from "@emotion/react";
import { userTheme } from "../../theme/userTheme";
import { Navbar } from "../../components/Navbar";
import { Container, Paper } from "@mui/material";
import { SignUpForm } from "../../components/SignUpForm";

export function UserSignUpPage() {
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
        <ThemeProvider theme={userTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        mt: 8,
                        p: 4
                    }}
                >
                    <SignUpForm
                        onSubmit={handleSignUp}
                        role="USER"
                    />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}