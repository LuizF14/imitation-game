import { api } from "../../../shared/api/client";
import { sessionSchema } from "../schemas/SessionSchema";
import { userSchema } from "../schemas/UserSchema";
import { userStatsSchema } from "../schemas/UserStatsSchema";

export const UserAPI = {
    getMe: async () => {
        const response = await api.get("/user/me");
        return await userSchema.validate(response.data);
    },

    getMyStats: async () => {
        const response = await api.get("/user/stats");
        return await userStatsSchema.validate(response.data, {
            stripUnknown: true,
        });
    },

    getActiveSession: async () => {
        const response = await api.get("/chatsession");
        return await sessionSchema.validate(response.data, {
            stripUnknown: true,
        })
    }
};