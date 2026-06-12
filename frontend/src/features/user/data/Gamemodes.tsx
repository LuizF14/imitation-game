import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ImageSearchOutlinedIcon from "@mui/icons-material/ImageSearchOutlined";
import { APP_ROUTES } from "../../../app/router/appRoutes";

interface GameMode {
    key: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    detail: string;
    route: string;
    available: boolean;
}

export const gameModes: GameMode[] = [
    {
        key: "chat",
        icon: <ForumOutlinedIcon sx={{ fontSize: 32 }} />,
        label: "user.gamemodes.chat.label",
        description: "user.gamemodes.chat.description",
        detail: "user.gamemodes.chat.detail",
        route: APP_ROUTES.CHAT_SESSION,
        available: true,
    },
    {
        key: "image",
        icon: <ImageSearchOutlinedIcon sx={{ fontSize: 32 }} />,
        label: "user.gamemodes.image.label",
        description: "user.gamemodes.image.description",
        detail: "user.gamemodes.image.detail",
        route: APP_ROUTES.IMAGE_SESSION,
        available: true,
    },
];