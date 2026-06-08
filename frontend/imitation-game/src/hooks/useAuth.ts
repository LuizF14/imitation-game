import type { Roles } from "../constants/rolesEnum";

export function useAuth() {
    return {
        isAuthenticated: true,
        role: "AIPROVIDER" as Roles,
    };
}