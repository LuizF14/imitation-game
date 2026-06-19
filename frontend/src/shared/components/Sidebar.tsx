import {  Drawer,  IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

import type { SidebarLink } from "../types/SidebarLinks";
import { SidebarContent } from "./SidebarContent";
import type { Profile } from "../types/Profile";

interface SidebarProps {
    links: SidebarLink[];
    drawerWidth?: number;
    profile: Profile;
}

const DEFAULT_WIDTH = 240;

export function Sidebar({ links, drawerWidth = DEFAULT_WIDTH, profile }: SidebarProps) {
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
                <SidebarContent links={links} drawerWidth={drawerWidth} profile={profile}/>
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
                <SidebarContent links={links} drawerWidth={drawerWidth} profile={profile}/>
            </Drawer>
        </>
    );
}