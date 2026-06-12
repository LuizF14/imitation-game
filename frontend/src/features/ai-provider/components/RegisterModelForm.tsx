import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { createRegisterModelFormSchema } from "../schemas/RegisterModelFormSchema";
import type { RegisterModelFormData } from "../types/RegisterModelFormData";
import { Alert, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { registerModelFormStyles } from "../styles/RegisterModelForm.styles";

interface Props {
    onSubmit: (data: RegisterModelFormData) => Promise<void> | void;
    loading?: boolean;
    error?: string;
}

export function RegisterModelForm({onSubmit, loading, error}: Props) {
    const {t} = useTranslation();
    const schema = useMemo(() => createRegisterModelFormSchema(t), [t]);
    
    const {register, handleSubmit, control, formState: { errors } } = useForm<RegisterModelFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            pathURL: "",
            type: "Chat"
        },
    });

    const submitForm = async (data: RegisterModelFormData) => {
        await onSubmit(data);
    };

    return (
        <Stack component="form" spacing={3} sx={{pt: 3}} onSubmit={handleSubmit(submitForm)}>
            <TextField label={t("aiprovider.registerModelModal.modelName")} placeholder="e.g. Chameleon-7B"
                size="small" error={!!errors.name} helperText={errors.name?.message} {...register("name")} fullWidth />

            <TextField label={t("aiprovider.registerModelModal.pathUrl")} placeholder="/models/my-bot"
                size="small" error={!!errors.pathURL} helperText={errors.pathURL?.message} {...register("pathURL")} fullWidth />

            <FormControl fullWidth size="small" error={!!errors.type}>
                <InputLabel id="type-label">
                    {t("aiprovider.registerModelModal.type")}
                </InputLabel>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select {...field} labelId="type-label" label="Type" >
                            <MenuItem value="Chat">
                                Chat
                            </MenuItem>
                            <MenuItem value="Image">
                                Image
                            </MenuItem>
                        </Select>
                    )}
                />
                <FormHelperText>
                    {errors.type?.message}
                </FormHelperText>
            </FormControl>

            {error && (
                <Alert severity="error">{error}</Alert>
            )}

            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={registerModelFormStyles.submitBtn} >
                {loading ? t("aiprovider.registerModelModal.loading") : t("aiprovider.registerModelModal.registerModel")}
            </Button>
        </Stack>
    );
}