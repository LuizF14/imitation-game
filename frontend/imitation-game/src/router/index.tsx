import {createBrowserRouter} from "react-router-dom";

import { UserLoginPage } from "../pages/User/UserLoginPage";
import { APP_ROUTES } from "../constants/appRoutes";
import { AIProviderLoginPage } from "../pages/AIProvider/AIProviderLoginPage";
import { AdminLoginPage } from "../pages/Admin/AdminLoginPage";
import { UserSignUpPage } from "../pages/User/UserSignUpPage";
import { AIProviderSignUpPage } from "../pages/AIProvider/AIProviderSignUpPage";
import { AdminRegisterPage } from "../pages/Admin/AdminRegisterPage";
import { LandingPage } from "../pages/landingpage";
import { UserHomePage } from "../pages/User/UserHomePage";
import { ProtectedRoute } from "../components/ProtectedRoutes";
import { AIProviderHomePage } from "../pages/AIProvider/AIProviderHomePage";

export const router = createBrowserRouter([
    {
        path: APP_ROUTES.USER_LOGIN,
        element: <UserLoginPage />
    },
    {
        path: APP_ROUTES.AIPROVIDER_LOGIN,
        element: <AIProviderLoginPage />
    },
    {
        path: APP_ROUTES.ADMIN_LOGIN,
        element: <AdminLoginPage />
    },
    {
        path: APP_ROUTES.USER_SIGNUP,
        element: <UserSignUpPage />
    }, 
    {
        path: APP_ROUTES.AIPROVIDER_SIGNUP,
        element: <AIProviderSignUpPage />
    },
    {
        path: APP_ROUTES.ADMIN_REGISTER,
        element: <AdminRegisterPage />
    }, 
    {
        path: APP_ROUTES.LANDING_PAGE,
        element: <LandingPage />
    },
    {
        path: APP_ROUTES.USER_HOME_PAGE,
        element: (
            <ProtectedRoute requiredRole="USER">
                <UserHomePage />
            </ProtectedRoute>
        )
    },
    {
        path: APP_ROUTES.AIPROVIDER_HOME_PAGE,
        element: (
            <ProtectedRoute requiredRole="AIPROVIDER">
                <AIProviderHomePage />
            </ProtectedRoute>
        )
    }
]);