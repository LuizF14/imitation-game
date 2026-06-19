import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtPayload";

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