import { jwtDecode } from "jwt-decode";
import type { Roles } from "../../../app/constants/rolesEnum";

interface JwtPayload {
    id: string;
    role: Roles;
    exp: number;
}

export function useAuth() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return {
            isAuthenticated: false,
            role: undefined,
            userId: undefined,
        };
    }

    try {
        const payload = jwtDecode<JwtPayload>(token);

        return {
            isAuthenticated: true,
            role: payload.role,
            userId: payload.id,
        };
    } catch {
        return {
            isAuthenticated: false,
            role: undefined,
            userId: undefined,
        };
    }
}