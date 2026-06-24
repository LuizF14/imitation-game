import axios from "axios";
import { UserAuthAPI } from "../../features/auth/api/userAuth.api";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../features/auth/types/JwtPayload";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.data?.error === "Access token expired") {
        const token = localStorage.getItem("access_token");

        if (!token) {
            return Promise.reject(error);
        }

        const payload = jwtDecode<JwtPayload>(token);

        let refreshResponse;

        switch (payload.role) {
            case "USER":
                refreshResponse = await UserAuthAPI.refresh();
                break;

            // case "ADMIN":
            //     refreshResponse = await AdminAuthAPI.refresh();
            //     break;

            // case "AIPROVIDER":
            //     refreshResponse = await AIProviderAuthAPI.refresh();
            //     break;

            default:
                return Promise.reject(error);
        }

        localStorage.setItem(
            "access_token",
            refreshResponse.data.access_token
        );

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
        return api(originalRequest);
    }

    return Promise.reject(error);
});