import * as yup from "yup";

export const userStatsSchema = yup.object({
    sessionsPlayed: yup.number().required(),
    score: yup.number().required(),
    avgTuringRate: yup.number().required(),
    ranking: yup.number().required(),
});

export type UserStats = yup.InferType<typeof userStatsSchema>;