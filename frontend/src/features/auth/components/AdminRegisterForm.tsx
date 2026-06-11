import { useTranslation } from "react-i18next";
import { PasswordField } from "./PasswordField";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { createAdminSignUpSchema } from "../schemas/adminSignUpSchema";
import type { AdminSignUpData } from "../types/AdminSignUpData";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { signUpFormStyles } from "../styles/SignUpForm.styles";

type AIProviderFormProps = {
    onSubmit: (data: AdminSignUpData) => Promise<void> | void;
    loading?: boolean;
    error?: string;
}

export function AdminRegisterForm({onSubmit, loading = false, error}: AIProviderFormProps) {
    const { t } = useTranslation();
    const schema = useMemo(() => createAdminSignUpSchema(t), [t]);

    const {register, handleSubmit, formState: { errors } } = useForm<AdminSignUpData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={signUpFormStyles.form}>
            <Typography variant="h4" component="h2">{t(`auth.signup.title.ADMIN`)}</Typography>

            <TextField label={t("auth.name")} fullWidth error={!!errors.name} helperText={errors.name?.message} {...register("name")} />
            <TextField label={t("auth.email")} fullWidth error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
            <PasswordField label={t("auth.password")} fullWidth error={!!errors.password} helperText={errors.password?.message} {...register("password")} />
            <PasswordField label={t("auth.confirmPassword")} fullWidth error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} {...register("confirmPassword")}/>

            {error && (
                <Alert severity="error">{error}</Alert>
            )}

            <Button type="submit" variant="contained" disabled={loading} size="large">
                {loading ? t("auth.signup.loading") : t("auth.signup.submit")}
            </Button>
        </Box>
    );
}