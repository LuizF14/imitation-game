import * as yup from "yup";
import type { TFunction } from "i18next";

export const createLoginSchema = (t: TFunction) =>
    yup.object({
        email: yup
            .string()
            .email(t("auth.invalidEmail"))
            .required(t("auth.requiredEmail")),

        password: yup
            .string()
            .min(6, t("auth.shortPassword"))
            .required(t("auth.requiredPassword")),
    });