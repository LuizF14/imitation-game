import type { TFunction } from "i18next";
import * as yup from "yup";

export const createRegisterModelFormSchema = (t: TFunction) =>
    yup.object({
        name: yup
            .string()
            .required(t("aiprovider.registerModelModal.modelNameRequired")),

        pathURL: yup
            .string()
            .matches(/^(\/[a-zA-Z0-9_-]+)+$/)
            .required(),

        type: yup
            .string()
            .required(t("aiprovider.registerModelModal.pathUrlRequired"))
            .oneOf(["Chat", "Image"] as const),
    });