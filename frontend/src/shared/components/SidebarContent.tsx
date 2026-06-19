import SearchIcon from "@mui/icons-material/Search";

import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Box, Divider, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Stack, Typography } from "@mui/material";
import type { SidebarLink } from "../types/SidebarLinks";
import type { Profile } from "../types/Profile";

export interface SidebarProps {
    links: SidebarLink[];
    drawerWidth?: number;
    profile: Profile;
}

export function SidebarContent({ profile, links, drawerWidth }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();

    return (
        <Box
            sx={{
                width: drawerWidth,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                borderRight: "0.5px solid",
                borderColor: "divider",
            }}
        >
            <Box
                onClick={() => navigate(profile.route)}
                sx={{
                    px: 2,
                    py: 1.75,
                    borderBottom: "0.5px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                    "&:hover": {
                        bgcolor: "rgba(255,255,255,0.03)",
                        "& .profile-link": {
                            textDecoration: "underline",
                        },
                    },
                }}
            >
                {profile.loading && (
                    <Stack direction="row" sx={{alignItems: "center"}} spacing={1.5}>
                        <Skeleton variant="circular" width={36} height={36} sx={{ bgcolor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Skeleton variant="text" width="70%" sx={{ bgcolor: "rgba(255,255,255,0.06)", fontSize: "0.875rem", mb: 0.5 }} />
                            <Skeleton variant="text" width="40%" sx={{ bgcolor: "rgba(255,255,255,0.06)", fontSize: "0.72rem" }} />
                        </Box>
                    </Stack>
                )}
                {profile.name && <Stack direction="row" sx={{alignItems: "center"}} spacing={1.5}>
                    <Avatar
                        src={profile.avatarUrl || undefined}
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "primary.dark",
                            fontSize: "0.85rem",
                            color: "primary.contrastText",
                            flexShrink: 0,
                        }}
                    >
                        {!profile.avatarUrl && profile.name.charAt(0).toUpperCase()}
                    </Avatar>
 
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.primary",
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {profile.name}
                        </Typography>
                        <Typography
                            className="profile-link"
                            variant="caption"
                            sx={{
                                color: "text.disabled",
                                fontSize: "0.72rem",
                                transition: "color 0.15s",
                            }}
                        >
                            View profile
                        </Typography>
                    </Box>
                </Stack>}
            </Box>


            {/* Barra de pesquisa */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: "0.5px solid",
                    borderColor: "divider",
                }}
            >
                <SearchIcon sx={{ fontSize: 18, color: "text.disabled", flexShrink: 0 }} />
                <InputBase
                    placeholder="Search..."
                    fullWidth
                    sx={{
                        fontSize: "0.85rem",
                        color: "text.primary",
                        "& input::placeholder": { color: "text.disabled" },
                    }}
                />
            </Box>

            {/* Links */}
            <List sx={{ flex: 1, px: 1, py: 1.5 }} disablePadding>
                {links.map((link) => {
                    const active = location.pathname === link.route;
                    return (
                        <ListItem key={link.key} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(link.route)}
                                sx={{
                                    borderRadius: 1.5,
                                    px: 1.5,
                                    py: 1,
                                    bgcolor: active ? "rgba(255,255,255,0.05)" : "transparent",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 36,
                                        color: active ? "primary.light" : "text.disabled",
                                    }}
                                >
                                    {link.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={t(link.label)}
                                    slotProps={{
                                        primary: {
                                            sx: {
                                                fontSize: "0.875rem",
                                                fontWeight: active ? 500 : 400,
                                                color: active ? "text.primary" : "text.secondary",
                                            }
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: "divider" }} />

            <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem" }}>
                    Imitation Game
                </Typography>
            </Box>
        </Box>
    );
}