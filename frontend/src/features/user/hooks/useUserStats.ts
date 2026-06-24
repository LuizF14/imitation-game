import { useAuth } from "../../auth/hooks/useAuth";
import { UserAPI } from "../api/user.api";

import { useQuery } from '@tanstack/react-query';

export function useUserStats() {
    const { userId } = useAuth();
    
    return useQuery({
        queryKey: ["userIdStats", userId],
        queryFn: UserAPI.getMyStats,
        enabled: !!userId,
    });
}