import { useTranslation } from "react-i18next";
import { PasswordField } from "./PasswordField";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { createAIProviderSignUpSchema } from "../schemas/aiProviderSignUpSchema";
import type { AIProviderSignUpData } from "../types/AIProviderSignUpData";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { signUpFormStyles } from "../styles/SignUpForm.styles";

type AIProviderFormProps = {
    onSubmit: (data: AIProviderSignUpData) => Promise<void> | void;
    loading?: boolean;
    error?: string;
}

export function AIProviderSignUpForm({onSubmit, loading = false, error}: AIProviderFormProps) {
    const { t } = useTranslation();
    const schema = useMemo(() => createAIProviderSignUpSchema(t), [t]);

    const {register, handleSubmit, formState: { errors } } = useForm<AIProviderSignUpData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            baseURL: "",
        }
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={signUpFormStyles.form}>
            <Typography variant="h4" component="h2">{t(`auth.signup.title.AIPROVIDER`)}</Typography>

            <TextField label={t("auth.name")} fullWidth error={!!errors.name} helperText={errors.name?.message} {...register("name")} />
            <TextField label={t("auth.email")} fullWidth error={!!errors.email} helperText={errors.email?.message} {...register("email")} />
            <PasswordField label={t("auth.password")} fullWidth error={!!errors.password} helperText={errors.password?.message} {...register("password")} />
            <PasswordField label={t("auth.confirmPassword")} fullWidth error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} {...register("confirmPassword")}/>
            <TextField label={t("auth.baseURL")} fullWidth error={!!errors.baseURL} helperText={errors.baseURL?.message} {...register("baseURL")}/>

            {error && (
                <Alert severity="error">{error}</Alert>
            )}

            <Button type="submit" variant="contained" disabled={loading} size="large">
                {loading ? t("auth.signup.loading") : t("auth.signup.submit")}
            </Button>
        </Box>
    );
}