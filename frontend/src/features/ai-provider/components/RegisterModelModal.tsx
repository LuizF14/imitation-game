import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { useState } from "react";

// --- Tipos ---
type ModelType = "Chat" | "Image";
type Step = "form" | "apikey";

interface FormValues {
    name: string;
    pathUrl: string;
    type: ModelType | "";
}

interface FormErrors {
    name?: string;
    pathUrl?: string;
    type?: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

// --- Mock: simula chamada ao backend ---
async function mockRegisterModel(values: FormValues): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return "ig_sk_" + Math.random().toString(36).slice(2, 18).toUpperCase();
}

// --- Validação ---
const PATH_REGEX = /^(\/[a-zA-Z0-9_-]+)+$/;

function validate(values: FormValues): FormErrors {
    const errors: FormErrors = {};
    if (!values.name.trim()) errors.name = "Name is required.";
    if (!values.pathUrl.trim()) {
        errors.pathUrl = "Path URL is required.";
    } else if (!PATH_REGEX.test(values.pathUrl)) {
        errors.pathUrl = "Must follow the format /segment/subsegment (e.g. /models/my-bot).";
    }
    if (!values.type) errors.type = "Type is required.";
    return errors;
}

export function RegisterModelModal({ open, onClose }: Props) {
    const [step, setStep] = useState<Step>("form");
    const [values, setValues] = useState<FormValues>({ name: "", pathUrl: "", type: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [copied, setCopied] = useState(false);

    function handleClose() {
        // Reset ao fechar
        setStep("form");
        setValues({ name: "", pathUrl: "", type: "" });
        setErrors({});
        setApiKey("");
        setCopied(false);
        setLoading(false);
        onClose();
    }

    function handleChange(field: keyof FormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    async function handleSubmit() {
        const newErrors = validate(values);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        try {
            const key = await mockRegisterModel(values);
            setApiKey(key);
            setStep("apikey");
        } finally {
            setLoading(false);
        }
    }

    async function handleCopy() {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                    bgcolor: 'background.paper', // ou sua string de cor
                    backgroundImage: 'none', 
                    border: '1px solid', 
                    borderColor: 'divider' 
                },
                },
            }}
        >
            {/* Header */}
            <DialogTitle sx={{ p: 0 }}>
                <Stack
                    direction="row"
                    sx={{ px: 3, py: 2.5, alignItems: "center", justifyContent: "space-between" }}
                >
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={1.5}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                bgcolor: "rgba(186, 117, 23, 0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "primary.light",
                            }}
                        >
                            {step === "form"
                                ? <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />
                                : <VpnKeyOutlinedIcon sx={{ fontSize: 18 }} />
                            }
                        </Box>
                        <Typography variant="h5" sx={{ fontSize: "1rem" }}>
                            {step === "form" ? "Register new model" : "Model registered"}
                        </Typography>
                    </Stack>

                    {step === "form" && (
                        <IconButton size="small" onClick={handleClose} sx={{ color: "text.disabled" }}>
                            <CloseOutlinedIcon fontSize="small" />
                        </IconButton>
                    )}
                </Stack>
                <Divider sx={{ borderColor: "divider" }} />
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 3 }}>

                {/* Step 1 — Formulário */}
                {step === "form" && (
                    <Stack spacing={3}>
                        <TextField
                            label="Model name"
                            placeholder="e.g. Chameleon-7B"
                            value={values.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            size="small"
                        />

                        <TextField
                            label="Path URL"
                            placeholder="/models/my-bot"
                            value={values.pathUrl}
                            onChange={(e) => handleChange("pathUrl", e.target.value)}
                            error={!!errors.pathUrl}
                            helperText={errors.pathUrl ?? "Follow the format /segment/subsegment"}
                            fullWidth
                            size="small"
                        />

                        <FormControl fullWidth size="small" error={!!errors.type}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                label="Type"
                                value={values.type}
                                onChange={(e) => handleChange("type", e.target.value)}
                            >
                                <MenuItem value="Chat">Chat</MenuItem>
                                <MenuItem value="Image">Image</MenuItem>
                            </Select>
                            {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                        </FormControl>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{
                                mt: 1,
                                py: 1.25,
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": { bgcolor: "primary.dark" },
                            }}
                        >
                            {loading ? "Registering..." : "Register model"}
                        </Button>
                    </Stack>
                )}

                {/* Step 2 — API Key */}
                {step === "apikey" && (
                    <Stack spacing={3}>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "rgba(186, 117, 23, 0.05)",
                                border: "0.5px solid",
                                borderColor: "primary.dark",
                                borderRadius: 1.5,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{ color: "primary.main", display: "block", mb: 1, fontSize: "0.72rem", letterSpacing: "0.06em" }}
                            >
                                YOUR API KEY
                            </Typography>
                            <Stack direction="row" sx={{alignItems: "center", justifyContent: "space-between"}} spacing={1}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: "monospace",
                                        color: "text.primary",
                                        wordBreak: "break-all",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {apiKey}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={handleCopy}
                                    sx={{ color: copied ? "success.main" : "text.disabled", flexShrink: 0 }}
                                >
                                    {copied
                                        ? <CheckOutlinedIcon fontSize="small" />
                                        : <ContentCopyOutlinedIcon fontSize="small" />
                                    }
                                </IconButton>
                            </Stack>
                        </Box>

                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "rgba(255, 255, 255, 0.02)",
                                border: "0.5px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                            }}
                        >
                            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, fontSize: "0.82rem" }}>
                                <strong style={{ color: "inherit" }}>Save this key now.</strong> For security reasons,
                                it will not be shown again. Use it to authenticate your model's requests to the Imitation Game API.
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleClose}
                            sx={{
                                py: 1.25,
                                borderColor: "primary.dark",
                                color: "primary.light",
                                "&:hover": {
                                    borderColor: "primary.main",
                                    bgcolor: "rgba(186, 117, 23, 0.06)",
                                },
                            }}
                        >
                            Done
                        </Button>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}