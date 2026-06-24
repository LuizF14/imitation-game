import * as yup from "yup";

export const userSchema = yup.object({
    username: yup.string().required(),
});

export type User = yup.InferType<typeof userSchema>;