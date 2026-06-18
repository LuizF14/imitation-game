import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { SidebarLink } from "../../../shared/types/SidebarLinks";
import { APP_ROUTES } from "../../../app/router/appRoutes";

export const aiProviderSidebarLinks: SidebarLink[] = [
    {
        key: "manage",
        label: "sidebar.manage",
        icon: <AssistantPhotoIcon fontSize="small" />,
        route: APP_ROUTES.AIPROVIDER_HOME_PAGE,
    },
    {
        key: "profile",
        label: "sidebar.profile",
        icon: <PersonOutlinedIcon fontSize="small" />,
        route: APP_ROUTES.AIPROVIDER_PROFILE,
    },
    {
        key: "leaderboard",
        label: "sidebar.leaderboard",
        icon: <LeaderboardOutlinedIcon fontSize="small" />,
        route: APP_ROUTES.AIPROVIDER_LEADERBOARD,
    },
    {
        key: "settings",
        label: "sidebar.settings",
        icon: <SettingsOutlinedIcon fontSize="small" />,
        route: APP_ROUTES.AIPROVIDER_SETTINGS,
    },
];