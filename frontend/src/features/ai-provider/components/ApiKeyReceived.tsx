import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { apiKeyReceivedStyles } from "../styles/ApiKeyReceived.styles";
import { Trans, useTranslation } from "react-i18next";

interface Props {
    apiKey: string;
    copied: Boolean;
    handleCopy: () => void;
    handleClose: () => void;
}

export function ApiKeyReceived({apiKey, copied, handleCopy, handleClose} : Props) {
    const {t} = useTranslation();
    return (
        <Stack spacing={3}>
            <Box sx={apiKeyReceivedStyles.apiKeyBox} >
                <Typography variant="caption" sx={apiKeyReceivedStyles.apiKeyTitle} >
                    {t("aiprovider.registerModelModal.yourApiKey")}
                </Typography>
                <Stack direction="row" sx={{alignItems: "center", justifyContent: "space-between"}} spacing={1}>
                    <Typography variant="body2" sx={apiKeyReceivedStyles.apiKeyText} >
                        {apiKey}
                    </Typography>
                    <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? "success.main" : "text.disabled", flexShrink: 0 }} >
                        {copied ? <CheckOutlinedIcon fontSize="small" /> : <ContentCopyOutlinedIcon fontSize="small" /> }
                    </IconButton>
                </Stack>
            </Box>

            <Box sx={apiKeyReceivedStyles.warning} >
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, fontSize: "0.82rem" }}>
                    <Trans i18nKey="aiprovider.registerModelModal.warning">
                        <strong style={{ color: "inherit" }}>Save this key now.</strong> For security reasons,
                        it will not be shown again. Use it to authenticate your model's requests to the Imitation Game API.
                    </Trans>
                </Typography>
            </Box>

            <Button variant="outlined" fullWidth onClick={handleClose} sx={apiKeyReceivedStyles.close} >
                {t("aiprovider.registerModelModal.done")}
            </Button>
        </Stack>
    );
}