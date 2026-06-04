import {createBrowserRouter} from "react-router-dom";

import { UserLoginPage } from "../pages/User/UserLoginPage";
import { APP_ROUTES } from "../constants/appRoutes";
import { AIProviderLoginPage } from "../pages/AIProvider/AIProviderLoginPage";

export const router = createBrowserRouter([
    {
        path: APP_ROUTES.USER_LOGIN,
        element: <UserLoginPage />
    },
    {
        path: APP_ROUTES.AIPROVIDER_LOGIN,
        element: <AIProviderLoginPage />
    }
]);