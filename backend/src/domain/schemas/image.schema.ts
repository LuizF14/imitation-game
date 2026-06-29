import {z} from "zod";

export const imageSchema = z.object({
    categoryId: z.string().min(1).max(200),
    imageURL: z.string().url()
});

export type ImageDTO = z.infer<typeof imageSchema>;