import {z} from "zod";

export const judgmentSchema = z.object({
    turingRate: z.number().min(0).max(1)
});

export type JudgmentDTO = z.infer<typeof judgmentSchema>;