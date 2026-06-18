import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import type { LeaderboardTab } from "../types/LeaderboardTab";

interface Props {
    tabs: LeaderboardTab[];
}

export function LeaderboardTabs({ tabs }: Props) {
    const [active, setActive] = useState(0);

    return (
        <Box>
            <Box
                sx={{
                    borderBottom: "0.5px solid",
                    borderColor: "divider",
                    mb: 4,
                }}
            >
                <Tabs
                    value={active}
                    onChange={(_, val) => setActive(val)}
                    sx={{
                        minHeight: 40,
                        "& .MuiTabs-indicator": {
                            bgcolor: "primary.main",
                            height: "1px",
                        },
                        "& .MuiTab-root": {
                            minHeight: 40,
                            fontSize: "0.82rem",
                            color: "text.secondary",
                            textTransform: "none",
                            letterSpacing: "0.01em",
                            px: 0,
                            mr: 3,
                            "&.Mui-selected": {
                                color: "text.primary",
                            },
                        },
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.key} label={tab.label} disableRipple />
                    ))}
                </Tabs>
            </Box>

            {tabs[active]?.component}
        </Box>
    );
}