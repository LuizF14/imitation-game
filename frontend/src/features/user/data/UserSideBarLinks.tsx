import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import type { SidebarLink } from "../../../shared/components/Sidebar";
import { APP_ROUTES } from "../../../app/router/appRoutes";

export const userSidebarLinks: SidebarLink[] = [
    {
        key: "play",
        label: "user.sidebar.play",
        icon: <BoltOutlinedIcon fontSize="small" />,
        route: APP_ROUTES.USER_HOME_PAGE,
    },
    {
        key: "leaderboard",
        label: "user.sidebar.leaderboard",
        icon: <LeaderboardOutlinedIcon fontSize="small" />,
        route: APP_ROUTES.USER_LEADERBOARD,
    },
    {
        key: "history",
        label: "user.sidebar.history",
        icon: <HistoryOutlinedIcon fontSize="small" />,
        route: APP_ROUTES.USER_HISTORY,
    },
    {
        key: "profile",
        label: "user.sidebar.profile",
        icon: <PersonOutlinedIcon fontSize="small" />,
        route: APP_ROUTES.USER_PROFILE,
    },
    {
        key: "settings",
        label: "user.sidebar.settings",
        icon: <SettingsOutlinedIcon fontSize="small" />,
        route: APP_ROUTES.USER_SETTINGS,
    },
];