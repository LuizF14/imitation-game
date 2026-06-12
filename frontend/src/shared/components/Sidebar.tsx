import {  Box,  Divider,  Drawer,  IconButton,  List,  ListItem,  ListItemButton,  ListItemIcon,  ListItemText,  InputBase,  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface SidebarLink {
    key: string;
    label: string;
    icon: React.ReactNode;
    route: string;
}

interface Props {
    links: SidebarLink[];
    drawerWidth?: number;
}

const DEFAULT_WIDTH = 240;

function SidebarContent({ links, drawerWidth }: Required<Props>) {
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

            {/* Rodapé da sidebar */}
            <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem" }}>
                    Imitation Game
                </Typography>
            </Box>
        </Box>
    );
}

export function Sidebar({ links, drawerWidth = DEFAULT_WIDTH }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Botão hamburguer — só no mobile */}
            <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                    display: { xs: "flex", md: "none" },
                    position: "fixed",
                    bottom: 16,
                    left: 16,
                    zIndex: 1300,
                    bgcolor: "background.paper",
                    border: "0.5px solid",
                    borderColor: "divider",
                    "&:hover": { bgcolor: "background.paper" },
                }}
            >
                <MenuIcon fontSize="small" />
            </IconButton>

            {/* Mobile — temporary drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        bgcolor: "background.paper",
                        backgroundImage: "none",
                        borderRight: "none",
                    },
                }}
            >
                <SidebarContent links={links} drawerWidth={drawerWidth} />
            </Drawer>

            {/* Desktop — permanent drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        bgcolor: "transparent",
                        backgroundImage: "none",
                        border: "none",
                        top: "auto",
                        position: "relative",
                        height: "100%",
                    },
                }}
            >
                <SidebarContent links={links} drawerWidth={drawerWidth} />
            </Drawer>
        </>
    );
}