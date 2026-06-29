import {z} from "zod";
import { HumanOrAIEnum } from "../../../generated/prisma/enums.js";

export const imageRoundSchema = z.object({
    userAnswer: z.enum(HumanOrAIEnum, { error: () => ({ message: "Invalid Answer" }) })
});

export type ImageRoundDTO = z.infer<typeof imageRoundSchema>;