export const APP_ROUTES = {
    USER_LOGIN: "/user/login",
    AIPROVIDER_LOGIN: "/aiprovider/login",
    ADMIN_LOGIN: "/admin/login",
    USER_SIGNUP: "/user/signup",
    AIPROVIDER_SIGNUP: "/aiprovider/signup",
    ADMIN_REGISTER: "/admin/register",
    LANDING_PAGE: "/",
    USER_HOME_PAGE: "/user/home",
    AIPROVIDER_HOME_PAGE: "/aiprovider/home",
    CHAT_SESSION: "/chatsession",
    IMAGE_SESSION: "/imagesession",

    ADMIN_HOME: "/admin/home",

    USER_LEADERBOARD: "/user/leaderboard", 
    USER_PROFILE: "/user/profile",
    USER_HISTORY: "/user/history",
    USER_SETTINGS: "/user/settings",

    AIPROVIDER_LEADERBOARD: "/aiprovider/leaderboard", 
    AIPROVIDER_PROFILE: "/aiprovider/profile",
    AIPROVIDER_HISTORY: "/aiprovider/history",
    AIPROVIDER_SETTINGS: "/aiprovider/settings",

    AIPROVIDER_MODEL_DETAILS: "/aiprovider/models/:id"
} as const;