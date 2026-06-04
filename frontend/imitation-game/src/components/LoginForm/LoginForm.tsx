import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";

import {Alert, Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Typography} from "@mui/material";

import {Visibility, VisibilityOff} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import * as yup from 'yup';
import type { Roles } from '../../constants/rolesEnum';

type LoginFormProps = {
    onSubmit: (
        email: string,
        password: string,
        rememberMe: boolean
    ) => Promise<void> | void;
    loading?: boolean;
    error?: string;
    role: Roles;
};

interface ILogin {
    email: string;
    password: string;
    rememberMe: boolean;
}


export function LoginForm({onSubmit, loading = false, error, role}: LoginFormProps) {
    const {t} = useTranslation();
    const schema = yup.object({
        email: yup.string().email(t("auth.login.invalidEmail")).required(t("auth.login.requiredEmail")),
        password: yup.string().min(6, t("auth.login.shortPassword")).required(t("auth.login.requiredPassword")),
        rememberMe: yup.boolean().required()
    });
    const [showPassword, setShowPassword] = useState(false);

    const {register, handleSubmit, control, formState: { errors }} = useForm<ILogin>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        }
    });

    const submitForm = async (data: ILogin) => {
        await onSubmit(
            data.email,
            data.password,
            data.rememberMe
        );
    };

    return (
        <Box component="form" onSubmit={handleSubmit(submitForm)} sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%'
        }}>
            <Typography variant="h4" component="h2">{t(`auth.login.title.${role}`)}</Typography>

            <TextField label={t("auth.login.email")} fullWidth 
                error={!!errors.email} helperText={errors.email?.message} {...register("email")}/>

            <TextField label={t("auth.login.password")} type={showPassword ? "text" : "password"} fullWidth
                error={!!errors.password} helperText={errors.password?.message} {...register("password")}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            />

            <Controller name="rememberMe" control={control} defaultValue={false} 
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Checkbox checked={field.value} 
                                onChange={(event) => field.onChange(event.target.checked)}/>
                        }
                        label={t("auth.login.rememberMe")}
                    />
                )}
            />

            {error && (
                <Alert severity="error">{error}</Alert>
            )}

            <Button type="submit" variant="contained" disabled={loading} size="large">
                {loading ? t("auth.login.loading") : t("auth.login.submit")}
            </Button>
        </Box>
    );
}