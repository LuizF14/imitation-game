import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Roles } from "../constants/rolesEnum";

interface Props {
    children: React.ReactNode;
    requiredRole: Roles;
}

export function ProtectedRoute({ children, requiredRole }: Props) {
    const { role, isAuthenticated } = useAuth(); // seu hook de auth

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}