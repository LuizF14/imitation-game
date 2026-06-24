import { useAuth } from "../../auth/hooks/useAuth";
import { UserAPI } from "../api/user.api";

import { useQuery } from '@tanstack/react-query';

export function useActiveSession() {
    const { userId } = useAuth();
    
    return useQuery({
        queryKey: ["userActiveSession", userId],
        queryFn: UserAPI.getActiveSession,
        enabled: !!userId,
    });
}