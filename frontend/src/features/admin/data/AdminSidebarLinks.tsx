import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import type { SidebarLink } from "../../../shared/types/SidebarLinks";
import { APP_ROUTES } from "../../../app/router/appRoutes";

export const adminSidebarLinks: SidebarLink[] = [
    {
        key: "manage",
        label: "sidebar.manage",
        icon: <AssistantPhotoIcon fontSize="small" />,
        route: APP_ROUTES.ADMIN_HOME,
    },
];