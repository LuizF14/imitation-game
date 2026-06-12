import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography, } from "@mui/material";

import { useState } from "react";
import { RegisterModelForm } from "./RegisterModelForm";
import { ApiKeyReceived } from "./ApiKeyReceived";
import type { RegisterModelFormData } from "../types/RegisterModelFormData";
import { registerModelStyles } from "../styles/RegisterModelModal.styles";
import { useTranslation } from "react-i18next";
type Step = "form" | "apikey";

interface Props {
    open: boolean;
    onClose: () => void;
}

// // --- Mock: simula chamada ao backend ---
async function mockRegisterModel(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return "ig_sk_" + Math.random().toString(36).slice(2, 18).toUpperCase();
}

export function RegisterModelModal({ open, onClose }: Props) {
    const [step, setStep] = useState<Step>("form");
    const [apiKey, setApiKey] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation();

    function handleClose() {
        onClose();
    }

    async function handleCopy() {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function resetState() {
        setApiKey("");
        setCopied(false);
        setStep("form");
        setLoading(false);
    }

    async function handleSubmit(data: RegisterModelFormData) {
        setLoading(true);
        console.log(data);
        const newApiKey = await mockRegisterModel();
        setApiKey(newApiKey);
        setStep("apikey");
        setLoading(false);
    }

    return (
        <Dialog
            open={open}
            onClose={step === "form" ? handleClose : undefined} // impede fechar na tela da API key
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: { 
                        bgcolor: 'background.paper', 
                        backgroundImage: 'none', 
                        border: '1px solid', 
                        borderColor: 'divider' 
                    },
                },
                transition: {
                    onExited: resetState
                }
            }}
        >
            <DialogTitle sx={{ p: 0 }}>
                <Stack direction="row" sx={{ px: 3, py: 2.5, alignItems: "center", justifyContent: "space-between" }} >
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={1.5}>
                        <Box sx={registerModelStyles.headerBox} >
                            {step === "form" ? <SmartToyOutlinedIcon sx={{ fontSize: 18 }} /> : <VpnKeyOutlinedIcon sx={{ fontSize: 18 }} /> }
                        </Box>
                        <Typography variant="h5" sx={{ fontSize: "1rem" }}>
                            {step === "form" ? t("aiprovider.registerModelModal.registerNewModel") : t("aiprovider.registerModelModal.modelRegistered")}
                        </Typography>
                    </Stack>

                    {step === "form" && (
                        <IconButton size="small" onClick={handleClose} sx={{ color: "text.disabled" }}>
                            <CloseOutlinedIcon fontSize="small" />
                        </IconButton>
                    )}
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ px: 3 }}>
                {step === "form" && (
                    <RegisterModelForm onSubmit={handleSubmit} loading={loading}/>
                )}
                {step === "apikey" && (
                    <ApiKeyReceived apiKey={apiKey} copied={copied} handleClose={handleClose} handleCopy={handleCopy}/>
                )}
            </DialogContent>
        </Dialog>
    );
}