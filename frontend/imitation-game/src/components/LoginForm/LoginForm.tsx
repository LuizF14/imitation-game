import { useState } from "react";
import type { FormEvent } from "react";

import {Alert, Box, Button, Checkbox, FormControlLabel, 
        IconButton, InputAdornment, TextField, Typography} from "@mui/material";

import {Visibility, VisibilityOff} from "@mui/icons-material";

type LoginFormProps = {
    onSubmit: (
        email: string,
        password: string,
        rememberMe: boolean
    ) => Promise<void> | void;
    loading?: boolean;
    error?: string;
};

export function LoginForm({onSubmit, loading = false, error}: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await onSubmit(email, password, rememberMe);
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            <Typography variant="h5" component="h2">Entrar</Typography>

            <TextField label="Email" type="email" value={email}
                onChange={(event) => setEmail(event.target.value)} required fullWidth/>

            <TextField label="Senha" type={showPassword ? "text" : "password"} value={password} 
                onChange={(event) => setPassword(event.target.value)} required fullWidth
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? (<VisibilityOff />) : (<Visibility />)}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            />

            <FormControlLabel control={
                <Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)}/>
                }
                label="Me deixe conectado"
            />

            {error && (
                <Alert severity="error">{error}</Alert>
            )}

            <Button type="submit" variant="contained" disabled={loading} size="large">
                {loading ? "Entrando..." : "Entrar"}
            </Button>
        </Box>
    );
}