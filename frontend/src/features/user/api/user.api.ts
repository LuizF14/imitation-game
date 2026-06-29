import { api } from "../../../shared/api/client";
import type { ChatSession } from "../types/Session";
import type { User } from "../types/User";
import type { UserStats } from "../types/UserStats";

export class UserAPI {
    static async getMe(): Promise<User> {
        const response = await api.get("/user/me");
        return response.data;
    }

    static async getMyStats(): Promise<UserStats> {
        const response = await api.get("/user/stats");
        return response.data;
    }

    static async getActiveSession(): Promise<ChatSession> {
        const response = await api.get("/chatsession");
        return response.data;
    }
};