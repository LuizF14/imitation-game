import {createBrowserRouter} from "react-router-dom";

import { APP_ROUTES } from "./appRoutes";
import { LandingPage } from "../../features/landing/pages/LandingPage";
import { UserLoginPage } from "../../features/user/pages/UserLoginPage";
import { UserSignUpPage } from "../../features/user/pages/UserSignUpPage";
// import { AIProviderLoginPage } from "../pages/AIProvider/AIProviderLoginPage";
// import { AdminLoginPage } from "../../features/admin/pages/AdminLoginPage";
// import { UserSignUpPage } from "../pages/User/UserSignUpPage";
// import { AIProviderSignUpPage } from "../pages/AIProvider/AIProviderSignUpPage";
// import { AdminRegisterPage } from "../../features/admin/pages/AdminRegisterPage";
// import { LandingPage } from "../../features/landing/pages/LandingPage";
// import { UserHomePage } from "../../features/user/pages/UserHomePage";
// import { ProtectedRoute } from "../../shared/components/ProtectedRoutes";
// import { AIProviderHomePage } from "../pages/AIProvider/AIProviderHomePage";
// import { ChatSessionPage } from "../pages/User/ChatSessionPage";

export const router = createBrowserRouter([
    {
        path: APP_ROUTES.LANDING_PAGE,
        element: <LandingPage />
    },
    {
        path: APP_ROUTES.USER_LOGIN,
        element: <UserLoginPage />
    },
    // {
    //     path: APP_ROUTES.AIPROVIDER_LOGIN,
    //     element: <AIProviderLoginPage />
    // },
    // {
    //     path: APP_ROUTES.ADMIN_LOGIN,
    //     element: <AdminLoginPage />
    // },
    {
        path: APP_ROUTES.USER_SIGNUP,
        element: <UserSignUpPage />
    }, 
    // {
    //     path: APP_ROUTES.AIPROVIDER_SIGNUP,
    //     element: <AIProviderSignUpPage />
    // },
    // {
    //     path: APP_ROUTES.ADMIN_REGISTER,
    //     element: <AdminRegisterPage />
    // }, 
    // {
    //     path: APP_ROUTES.USER_HOME_PAGE,
    //     element: (
    //         <ProtectedRoute requiredRole="USER">
    //             <UserHomePage />
    //         </ProtectedRoute>
    //     )
    // },
    // {
    //     path: APP_ROUTES.AIPROVIDER_HOME_PAGE,
    //     element: (
    //         <ProtectedRoute requiredRole="AIPROVIDER">
    //             <AIProviderHomePage />
    //         </ProtectedRoute>
    //     )
    // },
    // {
    //     path: APP_ROUTES.CHAT_SESSION, 
    //     element: (
    //         <ProtectedRoute requiredRole="USER">
    //             <ChatSessionPage />
    //         </ProtectedRoute>
    //     )
    // }
]);