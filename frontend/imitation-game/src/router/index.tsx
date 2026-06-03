import {createBrowserRouter} from "react-router-dom";

import { UserLoginPage } from "../pages/User/UserLoginPage";
import { APP_ROUTES } from "../constants/appRoutes";

export const router = createBrowserRouter([
    {
        path: APP_ROUTES.LOGIN,
        element: <UserLoginPage />
    }
]);