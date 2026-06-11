import { ThemeProvider } from "@emotion/react";
import { userTheme } from "../../../app/themes/userTheme";
import { Navbar } from "../../../shared/components/Navbar";
import { Container, Paper } from "@mui/material";
import { UserSignUpForm } from "../../auth/components/UserSignUpForm";
import type { UserSignUpData } from "../../auth/types/UserSignUpData";

export function UserSignUpPage() {
    async function handleSignUp(data: UserSignUpData) {
        console.log(data);
    }

    return (
        <ThemeProvider theme={userTheme}>
            <Navbar></Navbar>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
                    <UserSignUpForm onSubmit={handleSignUp} />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}