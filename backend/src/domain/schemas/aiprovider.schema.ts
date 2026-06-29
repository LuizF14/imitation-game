import { z } from "zod";

export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must have at least 3 characters")
        .max(60, "Name must have at most 60 characters"),

    baseURL: z
        .string()
        .trim()
        .url("Invalid URL format"),

    email: z
        .string()
        .trim()
        .email("Invalid email"),

    password: z
        .string()
        .min(8, "Password must have at least 8 characters")
        .max(128, "Password too long")
});

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email"),
        
    password: z
        .string()
        .min(1, "Password is required")
});

export const updateMeSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must have at least 3 characters")
        .max(60, "Name must have at most 60 characters")
        .optional(), // .optional() pois o controller verifica se o campo foi enviado

    baseURL: z
        .string()
        .trim()
        .url("Invalid URL format")
        .optional()
}).refine(data => Object.keys(data).length > 0, {message: "No data provided for update"});

export type SignUpDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type UpdateMeDTO = z.infer<typeof updateMeSchema>;