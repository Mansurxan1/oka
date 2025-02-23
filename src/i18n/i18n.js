import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uz from "./locales/uz";
import ru from "./locales/ru";

const savedLanguage = localStorage.getItem("language") || "uz";

i18n.use(initReactI18next).init({
  resources: { uz, ru },
  lng: savedLanguage, 
  fallbackLng: "uz",
  interpolation: { escapeValue: false },
});

export default i18n;
 