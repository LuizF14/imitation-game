import type { Roles } from "../constants/rolesEnum";

export function useAuth() {
    return {
        isAuthenticated: true,
        role: "USER" as Roles,
    };
}