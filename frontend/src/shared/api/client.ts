import axios from "axios";
import { UserAuthAPI } from "../../features/auth/api/userAuth.api";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    console.log("aaaaaaa");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use((response) => response, async (error) => {
    console.log("Interceptor entrou");
    console.log(error.response?.status);
    console.log(error.response?.data);

    const originalRequest = error.config;
    if (error.response?.data?.error === "Access token expired") {
        const refreshResponse = await UserAuthAPI.refresh();

        localStorage.setItem("access_token", refreshResponse.data.access_token);

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;

        return api(originalRequest);
    }

    return Promise.reject(error);
});