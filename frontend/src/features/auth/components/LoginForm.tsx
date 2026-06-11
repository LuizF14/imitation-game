import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert, Box, Button, Checkbox, FormControlLabel, Link, TextField, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

import type { Roles } from '../../../app/constants/rolesEnum';
import { loginFormStyles } from '../styles/LoginForm.styles';
import type { LoginFormData } from '../types/Login';
import { PasswordField } from './PasswordField';
import { useMemo } from 'react';
import { createLoginSchema } from '../schemas/loginSchema';

type LoginFormProps = {
    onSubmit: (data: LoginFormData) => Promise<void> | void;
    onNavigateToRegister?: () => void;
    showSignUp?: boolean;
    loading?: boolean;
    error?: string;
    role: Roles;
};

export function LoginForm({onSubmit, onNavigateToRegister, showSignUp = true, loading = false, error, role}: LoginFormProps) {
    const {t} = useTranslation();
    const schema = useMemo(() => createLoginSchema(t), [t]);

    const {register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const submitForm = async (data: LoginFormData) => {
        await onSubmit(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(submitForm)} sx={loginFormStyles.form}>
            <Typography variant="h4" component="h2">{t(`auth.login.title.${role}`)}</Typography>

            <TextField autoComplete="email" label={t("auth.email")} fullWidth 
                error={!!errors.email} helperText={errors.email?.message} {...register("email")}/>

            <PasswordField label={t("auth.password")} fullWidth error={!!errors.password} 
                helperText={errors.password?.message} {...register("password")} />

            <FormControlLabel control={<Checkbox {...register("rememberMe")} />} label={t("auth.login.rememberMe")} />

            {error && (
                <Alert severity="error">{error}</Alert>
            )}

            <Button type="submit" variant="contained" disabled={loading} size="large">
                {loading ? t("auth.login.loading") : t("auth.login.submit")}
            </Button>

            {!showSignUp && (
                <Typography variant="body2" align="center" sx={loginFormStyles.bottomText}>
                    {t("auth.login.askAnotherAdmin")}
                </Typography>
            )}

            {showSignUp && (
                <Typography variant="body2" align="center" sx={loginFormStyles.bottomText} >
                    {t("auth.login.dontHaveAccount")}{" "}
                    <Link component="button" type="button" variant="body2" onClick={onNavigateToRegister} sx={loginFormStyles.link} >
                        {t("auth.login.signUpHere")}
                    </Link>
                </Typography>
            )}
        </Box>
    );
}