import {createBrowserRouter} from "react-router-dom";

import { APP_ROUTES } from "./appRoutes";
import { LandingPage } from "../../features/landing/pages/LandingPage";
import { UserLoginPage } from "../../features/auth/pages/UserLoginPage";
import { UserSignUpPage } from "../../features/auth/pages/UserSignUpPage";
import { AIProviderSignUpPage } from "../../features/auth/pages/AIProviderSignUpPage";
import { AIProviderLoginPage } from "../../features/auth/pages/AIProviderLoginPage";
import { AdminLoginPage } from "../../features/auth/pages/AdminLoginPage";
import { AdminRegisterPage } from "../../features/auth/pages/AdminRegisterPage";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoutes";
import { UserHomePage } from "../../features/user/pages/UserHomePage";
import { AIProviderHomePage } from "../../features/ai-provider/pages/AIProviderHomePage";
import { ChatSessionPage } from "../../features/chatsession/pages/ChatSessionPage";
import { UserProfilePage } from "../../features/user/pages/UserProfilePage";
import { UserLeaderboardPage } from "../../features/user/pages/UserLeaderboardPage";
import { UserSettingsPage } from "../../features/user/pages/UserSettingsPage";
import { UserHistoryPage } from "../../features/user/pages/UserHistoryPage";
import { ImageSessionPage } from "../../features/imagesession/pages/ImageSessionPage";
import { AIProviderLeaderboardPage } from "../../features/ai-provider/pages/AIProviderLeaderboardPage";
import { AIProviderProfilePage } from "../../features/ai-provider/pages/AIProviderProfilePage";
import { AIProviderSettingsPage } from "../../features/ai-provider/pages/AIProviderSettingsPage";
import { AIProviderDetailedModelPage } from "../../features/aimodels/pages/AIProviderDetailedModel";
import { AdminHomePage } from "../../features/admin/pages/AdminHomePage";
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
    },

    {
        path: APP_ROUTES.CHAT_SESSION, 
        element: (
            <ProtectedRoute requiredRole="USER">
                <ChatSessionPage />
            </ProtectedRoute>
        )
    },
    {
        path: APP_ROUTES.IMAGE_SESSION,
        element: (
            <ProtectedRoute requiredRole="USER">
                <ImageSessionPage />
            </ProtectedRoute>
        )
    },
    
    {
        path: APP_ROUTES.USER_PROFILE,
        element: (
            <ProtectedRoute requiredRole="USER">
                <UserProfilePage />
            </ProtectedRoute>
        )
    },
    {
        path: APP_ROUTES.USER_LEADERBOARD,
        element: (
            <ProtectedRoute requiredRole="USER">
                <UserLeaderboardPage />
            </ProtectedRoute>
        )
    },
    {
        path: APP_ROUTES.USER_SETTINGS,
        element: (
            <ProtectedRoute requiredRole="USER">
                <UserSettingsPage />
            </ProtectedRoute>
        )
    },
    {
        path: APP_ROUTES.USER_HISTORY,
        element: (
            <ProtectedRoute requiredRole="USER">
                <UserHistoryPage/>
            </ProtectedRoute>
        )
    },


    {
        path: APP_ROUTES.AIPROVIDER_LEADERBOARD,
        element: (
            <ProtectedRoute requiredRole="AIPROVIDER">
                <AIProviderLeaderboardPage/>
            </ProtectedRoute>
        )
    },
    {
        path: APP_ROUTES.AIPROVIDER_PROFILE,
        element: (
            <ProtectedRoute requiredRole="AIPROVIDER">
                <AIProviderProfilePage/>
            </ProtectedRoute>
        )
    },
    {
        path: APP_ROUTES.AIPROVIDER_SETTINGS,
        element: (
            <ProtectedRoute requiredRole="AIPROVIDER">
                <AIProviderSettingsPage/>
            </ProtectedRoute>
        )
    },

    {
        path: APP_ROUTES.AIPROVIDER_MODEL_DETAILS,
        element: (
            <ProtectedRoute requiredRole="AIPROVIDER">
                <AIProviderDetailedModelPage/>
            </ProtectedRoute>
        )
    },

    {
        path: APP_ROUTES.ADMIN_HOME,
        element: (
            <ProtectedRoute requiredRole="ADMIN">
                <AdminHomePage/>
            </ProtectedRoute>
        )
    }
]);