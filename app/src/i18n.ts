import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './translations/en'
import fr from './translations/fr'

const resources = {
  en,
  fr
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", //default language

    interpolation: {
    // By default, values passed into translations are escaped to prevent XSS
    // more information: https://www.i18next.com/translation-function/interpolation#unescape
    //  escapeValue: false
    }
  });

  export default i18n