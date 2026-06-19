import { api } from "../../../shared/api/client";
import type { LoginFormData } from "../types/Login";

export interface AIProviderSignUpRequest {
    name: string;
    email: string;
    password: string;
    baseURL: string;
}

export const AIProviderAuthAPI = {
    signup: (data: AIProviderSignUpRequest) => api.post("/aiprovider/signup", data),
    login: (data: LoginFormData) => api.post("/aiprovider/login", data),
};