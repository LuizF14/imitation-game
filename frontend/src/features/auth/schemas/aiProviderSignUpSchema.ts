import * as yup from "yup";
import type { TFunction } from "i18next";

export const createAIProviderSignUpSchema = (t: TFunction) =>
    yup.object({
        name: yup
            .string()
            .min(5, t("auth.shortName"))
            .required(t("auth.nameRequired")),

        email: yup
            .string()
            .email(t("auth.invalidEmail"))
            .required(t("auth.requiredEmail")),

        password: yup
            .string()
            .min(6, t("auth.shortPassword"))
            .required(t("auth.requiredPassword")),

        confirmPassword: yup
            .string()
            .required(t("auth.requiredPassword"))
            .oneOf(
                [yup.ref("password")],
                t("auth.signup.passwordsMustMatch")
            ),

        baseURL: yup
            .string()
            .url(t("auth.invalidURL"))
            .required(t("auth.requiredBaseURL"))
    });