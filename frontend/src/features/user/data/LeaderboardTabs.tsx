import { AIModelsLeaderboard } from "../../leaderboard/components/AIModelsLeaderboard";
import { UsersLeaderboard } from "../../leaderboard/components/UsersLeaderboard";

export const tabs = [
    { key: "users",  label: "Users",   component: <UsersLeaderboard /> },
    { key: "models", label: "AI Models", component: <AIModelsLeaderboard /> },
];
