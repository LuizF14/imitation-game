import { api } from "../../../shared/api/client";

export const UserAPI = {
    // signup: (data: UserSignUpRequest) => api.post("/user/signup", data),
    // login: (data: LoginFormData) => api.post("/user/login", data),
    getMe: () => api.get("/user/me"),
};