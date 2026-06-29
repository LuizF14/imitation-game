import {z} from "zod";

export const addCategorySchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .max(40, { message: "Name must be at most 40 characters long" }),
    basePrompt: z.string()
        .min(1, { message: "Base prompt is required" })
        .max(1024, { message: "Base prompt must be at most 1024 characters long" })
});

export const editCategorySchema = addCategorySchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "No data provided for update" }
);

export type AddCategoryDTO = z.infer<typeof addCategorySchema>;
export type EditCategoryDTO = z.infer<typeof editCategorySchema>;