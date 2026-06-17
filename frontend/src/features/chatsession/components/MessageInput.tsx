import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import { Box, IconButton, InputBase, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
    sessionEnded: boolean;
    input: string;
    setInput: (s:string) => void;
    handleSend: (s: string) => void;
}

export function MessageInput({sessionEnded, input, setInput, handleSend}: Props) {
    const {t} = useTranslation();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const text = input.trim();
        if (!text) return;
        handleSend(text);
        setInput("");
    }

    return (
        <Stack component="form" onSubmit={handleSubmit} direction="row" sx={{alignItems: "flex-end"}} spacing={1}>
            <Box
                sx={{
                    flex: 1,
                    bgcolor: "background.default",
                    border: "0.5px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    px: 2,
                    py: 1.25,
                    "&:focus-within": { borderColor: "primary.dark" },
                    transition: "border-color 0.2s",
                }}
            >
                <InputBase
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder={sessionEnded ? t("chatsession.messageInput.sessionEnded") : t("chatsession.messageInput.typeMessage")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={sessionEnded}
                    sx={{
                        fontSize: "0.875rem",
                        color: "text.primary",
                        "& textarea::placeholder": { color: "text.disabled" },
                    }}
                />
            </Box>

            <IconButton
                type="submit"
                disabled={!input.trim() || sessionEnded}
                sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    "&:hover": { bgcolor: "primary.dark" },
                    "&.Mui-disabled": { bgcolor: "background.paper", color: "text.disabled" },
                }}
            >
                <SendOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
        </Stack>
    );
}