import { ThemeProvider } from "@emotion/react";
import { Navbar } from "../../../shared/components/Navbar";
import { Container, Paper } from "@mui/material";
import { mainTheme } from "../../../app/themes/mainTheme";
import { AdminRegisterForm } from "../../auth/components/AdminRegisterForm";
import type { AdminSignUpData } from "../../auth/types/AdminSignUpData";

export function AdminRegisterPage() {
    async function handleSignUp(data: AdminSignUpData) {
        console.log(data);
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
                    <AdminRegisterForm onSubmit={handleSignUp} />
                </Paper>
            </Container>
        </ThemeProvider>
    );
}