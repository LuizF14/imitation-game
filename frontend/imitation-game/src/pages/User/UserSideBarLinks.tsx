import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { SidebarLink } from "../../components/Sidebar";

export const userSidebarLinks: SidebarLink[] = [
    {
        key: "play",
        label: "Play",
        icon: <BoltOutlinedIcon fontSize="small" />,
        route: "/user/home",
    },
    {
        key: "leaderboard",
        label: "Leaderboard",
        icon: <LeaderboardOutlinedIcon fontSize="small" />,
        route: "/user/leaderboard",
    },
    {
        key: "history",
        label: "Match history",
        icon: <HistoryOutlinedIcon fontSize="small" />,
        route: "/user/history",
    },
    {
        key: "profile",
        label: "Profile",
        icon: <PersonOutlinedIcon fontSize="small" />,
        route: "/user/profile",
    },
    {
        key: "settings",
        label: "Settings",
        icon: <SettingsOutlinedIcon fontSize="small" />,
        route: "/user/settings",
    },
];