import { api } from "../../../shared/api/client";
import type { LoginFormData } from "../types/Login";

export interface UserSignUpRequest {
    username: string;
    email: string;
    password: string;
}

export const UserAuthAPI = {
    signup: (data: UserSignUpRequest) => api.post("/user/signup", data),
    login: (data: LoginFormData) => api.post("/user/login", data),
    refresh: () => api.post("/user/refresh")
};