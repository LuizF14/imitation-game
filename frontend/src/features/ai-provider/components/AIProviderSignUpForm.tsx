import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import * as yup from 'yup';
import { SignUpForm, type BaseSignUpFields } from './SignUpForm';
import { t } from "i18next";

interface AiProviderSignUpFields extends BaseSignUpFields {
    baseURL: string;
}


type AiProviderSignUpFormProps = {
    onSubmit: (name: string, email: string, password: string, extra: { baseURL: string }) => void;
    loading?: boolean;
    error?: string;
};

export function AiProviderSignUpForm({ onSubmit, loading, error }: AiProviderSignUpFormProps) {
    const aiProviderExtraSchema = yup.object({
        baseURL: yup.string()
            .url(t("auth.invalidURL"))
            .required(t("auth.requiredBaseURL")),
    });
    return (
        <SignUpForm<AiProviderSignUpFields>
            role={"AIPROVIDER"}
            onSubmit={onSubmit}
            loading={loading}
            error={error}
            extraSchema={aiProviderExtraSchema}
            renderExtraFields={(control, errors) => (
                <Controller
                    name="baseURL"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Base URL"
                            fullWidth
                            placeholder="https://api.exemplo.com"
                            error={!!errors.baseURL}
                            helperText={errors.baseURL?.message as string}
                        />
                    )}
                />
            )}
        />
    );
}