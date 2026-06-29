import { z } from 'zod';
import { AIModelType } from '../../../generated/prisma/enums.js';

export const registerModelSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .max(60, { message: "Name must be at most 60 characters long" }),
    pathURL: z.string().url({ message: "Invalid URL path" }),
    type: z.enum(AIModelType, { error: () => ({ message: "Invalid AI Model Type" }) })
});

export const updateModelSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .max(60, { message: "Name must be at most 60 characters long" })
        .optional(),
    pathURL: z.string().url({ message: "Invalid URL path" }).optional(),
}).refine(data => Object.keys(data).length > 0, {message: "No data provided for update"});

export const searchModelSchema = z.object({
    query: z.string().min(2, { message: "Query too short (minimum 2 characters)" })
});

export type RegisterModelDTO = z.infer<typeof registerModelSchema>;
export type UpdateModelDTO = z.infer<typeof updateModelSchema>;
export type SearchModelDTO = z.infer<typeof searchModelSchema>;