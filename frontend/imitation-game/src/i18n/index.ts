import i18n from "i18next";

import { initReactI18next } from "react-i18next";

import ptBR from "./locales/pt-BR.json";
import en from "./locales/en.json"

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: "en",

        interpolation: {
            escapeValue: false
        },

        resources: {
            en: {
                translation: en
            },
            "pt-BR": {
                translation: ptBR
            }
        }
    });

export default i18n;