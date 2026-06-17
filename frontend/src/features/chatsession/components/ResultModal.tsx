import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { Box, Button, Dialog, DialogContent, Divider, Stack, Typography } from "@mui/material";
import type { SessionResult } from "../types/SessionResult";
import { useTranslation } from "react-i18next";

interface Props {
    result: SessionResult;
    turingRateGiven: number;
    onClose: () => void;
}

export function ResultModal({ result, turingRateGiven, onClose }: Props) {
    const {t} = useTranslation();

    return (
        <Dialog
            open
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                sx: {
                    bgcolor: 'background.paper', // or your string
                    backgroundImage: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                },
                },
            }}
        >
            <DialogContent sx={{ px: 3, py: 4 }}>
                <Stack sx={{alignItems: "center"}} spacing={3}>

                    {/* Ícone de resultado */}
                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: result.won ? "rgba(46,125,50,0.12)" : "rgba(211,47,47,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: result.won ? "success.main" : "error.main",
                        }}
                    >
                        {result.won
                            ? <EmojiEventsOutlinedIcon sx={{ fontSize: 28 }} />
                            : <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 28 }} />
                        }
                    </Box>

                    {/* Título */}
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {t("chatsession.resultModal.sessionEnded")}
                        </Typography>
                    </Box>

                    <Divider sx={{ borderColor: "divider", width: "100%" }} />

                    {/* Revelação do oponente */}
                    <Box
                        sx={{
                            width: "100%",
                            p: 2,
                            bgcolor: "background.default",
                            border: "0.5px solid",
                            borderColor: "divider",
                            borderRadius: 1.5,
                        }}
                    >
                        <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 1.5 }}>
                            {t("chatsession.resultModal.yourOpponentWas")}
                        </Typography>
                        <Stack direction="row" sx={{alignItems: "center"}} spacing={1.5}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    bgcolor: "background.paper",
                                    border: "0.5px solid",
                                    borderColor: "divider",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.disabled",
                                }}
                            >
                                {result.opponentType === "AI"
                                    ? <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
                                    : <PersonOutlinedIcon sx={{ fontSize: 16 }} />
                                }
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, lineHeight: 1 }}>
                                    {result.opponentName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.72rem" }}>
                                    {result.opponentType}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Métricas */}
                    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                        <Box
                            sx={{
                                flex: 1,
                                p: 2,
                                bgcolor: "background.default",
                                border: "0.5px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 }}>
                                {t("chatsession.resultModal.pointsEarned")}
                            </Typography>
                            <Typography variant="h4" sx={{ fontSize: "1.4rem", color: result.won ? "success.main" : "text.primary" }}>
                                +{result.pointsEarned}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                flex: 1,
                                p: 2,
                                bgcolor: "background.default",
                                border: "0.5px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem", display: "block", mb: 0.5 }}>
                                {t("chatsession.resultModal.turingRateGiven")}
                            </Typography>
                            <Typography variant="h4" sx={{ fontSize: "1.4rem", color: "text.primary", fontFamily: "monospace" }}>
                                {turingRateGiven.toFixed(1)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={onClose}
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
                        {t("chatsession.resultModal.backToHome")}
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}