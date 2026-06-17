import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import { Box, Slider, Stack, Typography } from "@mui/material";

interface Props {
    turingRate: number;
    setTuringRate: (n: number) => void;
    sessionEnded: boolean;
}

export function TuringRateSlider({turingRate, setTuringRate, sessionEnded}: Props) {
    return (
    <Box sx={{ mb: 2 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                Turing Rate
            </Typography>
            <Stack direction="row" sx={{alignItems: "center"}} spacing={1}>
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: 600,
                        color: "primary.light",
                        fontSize: "0.82rem",
                    }}
                >
                    {turingRate.toFixed(1)}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem" }}>
                    {turingRate === 0 ? "— definitely a robot" : turingRate === 1 ? "— definitely human" : turingRate < 0.4 ? "— likely a robot" : turingRate > 0.6 ? "— likely human" : "— uncertain"}
                </Typography>
            </Stack>
        </Stack>

        <Stack direction="row" sx={{alignItems: "center"}} spacing={2}>
            <SmartToyOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
            <Slider
                value={turingRate}
                onChange={(_, val) => setTuringRate(val as number)}
                min={0}
                max={1}
                step={0.1}
                disabled={sessionEnded}
                sx={{
                    color: "primary.main",
                    "& .MuiSlider-thumb": {
                        width: 16,
                        height: 16,
                        "&:hover": { boxShadow: "0 0 0 6px rgba(186,117,23,0.16)" },
                    },
                    "& .MuiSlider-rail": { opacity: 0.2 },
                }}
            />
            <PersonOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
        </Stack>
    </Box>
    );
}