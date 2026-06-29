import {z} from "zod";

export const messageSchema = z.object({
    content: z.string()
        .min(1, { message: "Name is required" })
        .max(1024, { message: "Name must be at most 1024 characters long" }),

    creationDurationMs: z.number().min(0)
});

export type MessageDTO = z.infer<typeof messageSchema>;