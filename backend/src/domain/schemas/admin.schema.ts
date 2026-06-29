import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must have at least 3 characters")
        .max(60, "Name must have at most 60 characters"), // Baseado no seu 'new Text(data.name, 60)'

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

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;