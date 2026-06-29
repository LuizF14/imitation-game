import {z} from "zod";

export const signupSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must have at least 3 characters")
        .max(40, "Username must have at most 40 characters"),

    email: z
        .email("Invalid email"),

    password: z
        .string()
        .min(8, "Password must have at least 8 characters")
        .max(128, "Password too long")
});

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1)
});

export const updateUserSchema = z.object({
    username: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .optional()
}).refine(data => Object.keys(data).length > 0, {message: "No data provided for update"});

export type SignUpDTO = z.infer<typeof signupSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type UpdateMeDTO = z.infer<typeof updateUserSchema>;
