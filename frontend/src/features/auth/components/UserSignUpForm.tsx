import { useTranslation } from "react-i18next";
import { PasswordField } from "./PasswordField";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { createUserSignUpSchema } from "../schemas/userSignUpSchema";
import type { UserSignUpData } from "../types/UserSignUpData";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { signUpFormStyles } from "./SignUpForm.styles";

type UserSignUpFormProps = {
    onSubmit: (data: UserSignUpData) => Promise<void> | void;
    loading?: boolean;
    error?: string;
}

export function UserSignUpForm({onSubmit, loading = false, error}: UserSignUpFormProps) {
    const { t } = useTranslation();
    const schema = useMemo(() => createUserSignUpSchema(t), [t]);

    const {register, handleSubmit, formState: { errors } } = useForm<UserSignUpData>({
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
            <Typography variant="h4" component="h2">{t(`auth.signup.title.USER`)}</Typography>

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