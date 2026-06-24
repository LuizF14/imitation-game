import * as yup from "yup";

export const sessionSchema = yup.object({
    sessionId: yup.string().required(),
    startedAt: yup.string().required()
});

export type Session = yup.InferType<typeof sessionSchema>;