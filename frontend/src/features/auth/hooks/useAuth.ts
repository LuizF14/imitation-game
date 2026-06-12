import type { Roles } from "../../../app/constants/rolesEnum";

export function useAuth() {
    return {
        isAuthenticated: true,
        role: "AIPROVIDER" as Roles,
    };
}