import { useForm, type Control, type FieldErrors, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import { Alert, Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { TFunction } from 'i18next';
import * as yup from 'yup';
import type { Roles } from '../constants/rolesEnum';

export interface BaseSignUpFields {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const buildBaseSchema = (t: TFunction) => yup.object({
    name: yup.string().min(5, t("auth.shortName")).required(t("auth.nameRequired")),
    email: yup.string().email(t("auth.invalidEmail")).required(t("auth.requiredEmail")),
    password: yup.string().min(6, t("auth.shortPassword")).required(t("auth.requiredPassword")),
    confirmPassword: yup.string()
        .min(6, t("auth.shortPassword"))
        .required(t("auth.requiredPassword"))
        .oneOf([yup.ref('password')], t("auth.signup.passwordsMustMatch")),
});

type ExtraFields<T extends BaseSignUpFields> = Omit<T, keyof BaseSignUpFields>;

type SignUpFormProps<T extends BaseSignUpFields = BaseSignUpFields> = {
    onSubmit: (name: string, email: string, password: string, extra: ExtraFields<T>) => Promise<void> | void;
    loading?: boolean;
    error?: string;
    role: Roles;
    extraSchema?: yup.ObjectSchema<ExtraFields<T>>;
    renderExtraFields?: (control: Control<T>, errors: FieldErrors<T>) => React.ReactNode;
};

export function SignUpForm<T extends BaseSignUpFields = BaseSignUpFields>({
    onSubmit, loading = false, error, role, extraSchema, renderExtraFields
}: SignUpFormProps<T>) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    type InternalFields = BaseSignUpFields & Record<string, unknown>;

    const schema = extraSchema
        ? buildBaseSchema(t).concat(extraSchema as yup.ObjectSchema<any>)
        : buildBaseSchema(t);

    const { register, handleSubmit, control, formState: { errors } } = useForm<InternalFields>({
        resolver: yupResolver(schema) as Resolver<InternalFields>,
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    const submitForm = async (data: InternalFields) => {
        const { name, email, password, confirmPassword: _, ...extra } = data;
        await onSubmit(name, email, password, extra as ExtraFields<T>);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(submitForm)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Typography variant="h4" component="h2">{t(`auth.signup.title.${role}`)}</Typography>

            <TextField
                label={t("auth.name")} fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
            />
            <TextField
                label={t("auth.email")} fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
            />
            <TextField
                label={t("auth.password")}
                type={showPassword ? "text" : "password"} fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(v => !v)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            />
            <TextField
                label={t("auth.confirmPassword")}
                type={showConfirmPassword ? "text" : "password"} fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword")}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(v => !v)}>
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                }}
            />

            {renderExtraFields?.(control as unknown as Control<T>, errors as unknown as FieldErrors<T>)}

            {error && <Alert severity="error">{error}</Alert>}

            <Button type="submit" variant="contained" disabled={loading} size="large">
                {loading ? t("auth.loading") : t("auth.signup.submit")}
            </Button>
        </Box>
    );
}