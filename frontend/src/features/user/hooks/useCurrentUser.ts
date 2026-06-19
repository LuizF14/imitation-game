import { useAuth } from "../../auth/hooks/useAuth";
import { UserAPI } from "../api/user.api";

import { useQuery } from '@tanstack/react-query';

export function useCurrentUser() {
    const { userId } = useAuth();
    
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => UserAPI.getMe(),
        enabled: !!userId,
    });
}