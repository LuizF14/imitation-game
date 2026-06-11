import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { SidebarLink } from "../../components/Sidebar";

export const aiProviderSidebarLinks: SidebarLink[] = [
    {
        key: "leaderboard",
        label: "Leaderboard",
        icon: <LeaderboardOutlinedIcon fontSize="small" />,
        route: "/aiprovider/leaderboard",
    },
    {
        key: "profile",
        label: "Profile",
        icon: <PersonOutlinedIcon fontSize="small" />,
        route: "/aiprovider/profile",
    },
    {
        key: "settings",
        label: "Settings",
        icon: <SettingsOutlinedIcon fontSize="small" />,
        route: "/aiprovider/settings",
    },
];